import { createContext, type ReactNode, useContext } from "react";
import { create, useStore, UseBoundStore, StoreApi } from "zustand";
import { BlocDefinition, BlocValue } from "./types";
import { combine } from "zustand/middleware";
import { setDeepValue } from "./utils/utils";
import { v4 as uuid } from "uuid";

type StoreState = {
    blocs: BlocDefinition[];
    data: BlocValue[];
    insertIndex: number | null;
    setInsertIndex: (index: number | null) => void;
    insertData: (bloc: BlocDefinition) => void;
    updateData: (v: unknown, path: string) => void;
};

export type Store = UseBoundStore<StoreApi<StoreState>>;

type EditorContextValue = {
    store: Store;
    iconsUrl: string;
    urlPreview: string;
};

const EditorContext = createContext<EditorContextValue>({} as EditorContextValue);

type EditorContextProviderProps = {
    iconsUrl: string;
    blocs: BlocDefinition[];
    data: BlocValue[];
    urlPreview: string;
    children?: ReactNode;
};

export const EditorContextProvider = ({
    blocs,
    iconsUrl,
    urlPreview,
    children,
    data: data,
}: EditorContextProviderProps) => {
    const store = create(
        combine(
            {
                blocs: blocs,
                data: data,
                insertIndex: null as number | null,
            },
            (set, getState) => {
                return {
                    setInsertIndex: (index: number | null) => {
                        set({ insertIndex: index });
                    },
                    insertData: (bloc: BlocDefinition) => {
                        const { data, insertIndex } = getState();

                        const newBlocData = {} as Record<string, any>;

                        bloc.fields.forEach((field) => {
                            newBlocData[field.name] = field.options.defaultValue;
                        });

                        const nextValue = [
                            ...data.slice(0, insertIndex!),
                            {
                                _name: bloc.name,
                                _id: uuid(),
                                data: newBlocData,
                            },
                            ...data.slice(insertIndex!),
                        ];

                        set({ data: nextValue });
                    },
                    updateData: (v: unknown, path: string) => {
                        const { data } = getState();
                        const keys = path.split(".");
                        set({ data: setDeepValue(data, keys, v) });
                    },
                };
            },
        ),
    );

    return (
        <EditorContext.Provider value={{ store: store, iconsUrl: iconsUrl, urlPreview: urlPreview }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditorContext must be used within EditorContextProvider");
    }
    return context;
};

export function usePartialStore(...keys: (keyof StoreState)[]) {
    const { store } = useEditorContext();
    return Object.fromEntries(keys.map((k) => [k, useStore(store, (state) => state[k])])) as Pick<
        StoreState,
        (typeof keys)[number]
    >;
}

export function useBlocsLibraryVisible() {
    const { insertIndex } = usePartialStore("insertIndex");
    return insertIndex !== null;
}

export function useBlocData(id: string) {
    const { store } = useEditorContext();
    return (
        useStore(store, (state) => state.data.find((b) => b._id == id)) || {
            _id: id,
            _name: "",
            data: {},
        }
    );
}

export function useBlocDefinition(name: string) {
    const { store } = useEditorContext();
    return useStore(store, (state) => state.blocs.find((b) => b.name === name));
}

export function useDataGetter(): () => BlocValue[] {
    const context = useContext(EditorContext);
    return () => context.store?.getState().data ?? [];
}
