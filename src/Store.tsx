import { createContext, type ReactNode, useContext } from "react";
import { create, useStore, UseBoundStore, StoreApi } from "zustand";
import { BlocDefinition, BlocValue, FieldDefinition } from "./types";
import { combine } from "zustand/middleware";
import { deleteFromArray, insertIntoArray, setDeepValue } from "./utils/utils";
import { v4 as uuid } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

type StoreState = {
    blocs: BlocDefinition[];
    data: BlocValue[];
    blocsOrder: string[];
    insertIndex: number | null;
    setInsertIndex: (index: number | null) => void;
    insertData: (bloc: BlocDefinition) => void;
    updateData: (v: unknown, path: string) => void;
    moveBloc: (fromIndex: number, toIndex: number) => void;
    getIndexById: (id: string) => number;
    removeData: (id: string) => void;
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
                blocsOrder: [] as string[],
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
                            if (field.group) {
                                const fields = (
                                    field.options[0].defaultValue // check if fiekdsDefinition[] | {fields : fiekdsDefinition[]}
                                        ? field.options
                                        : field.options.reduce(
                                              (
                                                  acc: any,
                                                  obj: {
                                                      fields: [];
                                                      useTabNameAsKey?: boolean;
                                                      name?: string;
                                                      key?: string;
                                                  },
                                              ) => {
                                                  const fields = obj.useTabNameAsKey
                                                      ? obj.fields.map((f) => {
                                                            return {
                                                                parent: obj.key ?? obj.name,
                                                                field: f,
                                                            };
                                                        })
                                                      : obj.fields;

                                                  return [...acc, ...fields];
                                              },
                                              [],
                                          )
                                ) as FieldDefinition<any, any>[];
                                console.log(fields);
                                fields.forEach(
                                    (
                                        f:
                                            | FieldDefinition<any, any>
                                            | { parent: string; field: FieldDefinition<any, any> },
                                    ) => {
                                        if ("parent" in f) {
                                            newBlocData[f.parent] ??= {};
                                            newBlocData[f.parent][f.field.name] = f.field.options.defaultValue;
                                            return;
                                        }

                                        newBlocData[f.name] = f.options.defaultValue;
                                    },
                                );

                                return;
                            }

                            newBlocData[field.name!] = field.options.defaultValue;
                        });

                        set({
                            data: insertIntoArray(data, insertIndex ?? data.length, {
                                _name: bloc.name,
                                _id: uuid(),
                                data: newBlocData,
                            }),
                        });
                    },
                    updateData: (v: unknown, path: string) => {
                        const { data } = getState();
                        const keys = path.split(".");
                        set({ data: setDeepValue(data, keys, v) });
                    },
                    moveBloc: (fromIndex: number, toIndex: number) => {
                        set((state) => {
                            const newData = arrayMove(state.data, fromIndex, toIndex);

                            return {
                                data: newData,
                                blocsOrder: newData.map((v) => v._id),
                            };
                        });
                    },
                    removeData: (id: string) => {
                        const { data } = getState();
                        const index = data.findIndex((b) => b._id === id);
                        if (index !== -1) {
                            set({ data: deleteFromArray(data, index) });
                        }
                    },
                    getIndexById: (id: string) => {
                        const { data } = getState();
                        return data.findIndex((b) => b._id === id);
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
