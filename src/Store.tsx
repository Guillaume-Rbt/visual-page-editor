import { createContext, type ReactNode, useContext } from "react";
import { create, useStore, UseBoundStore, StoreApi } from "zustand";
import { ComponentDefinition, ComponentValue } from "./types";
import { combine } from "zustand/middleware";
import { deleteFromArray, getFieldsDefaultValues, insertIntoArray, setDeepValue } from "./utils/utils";
import { v4 as uuid } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

export type EditorOptions = {
    reorderable: boolean;
    requiredBlocks: string[];
    allowAdd: boolean;
};

export const defaultEditorOptions: EditorOptions = {
    reorderable: true,
    requiredBlocks: [],
    allowAdd: true,
};

type StoreState = {
    editorOptions: EditorOptions;
    blocks: ComponentDefinition[];
    data: ComponentValue[];
    blocksOrder: string[];
    requiredIds: string[];
    insertIndex: number | null;
    focusIndex: number | null;
    animReorder: { sidebar: boolean; preview: boolean };
    storedData: ComponentValue[];
    setInsertIndex: (index: number | null) => void;
    insertData: (block: ComponentDefinition) => void;
    updateData: (v: unknown, path: string) => void;
    moveBlock: (fromIndex: number, toIndex: number, setFocus?: boolean) => void;
    getIndexById: (id: string) => number;
    removeData: (id: string) => void;
    setFocusIndex: (index: number | null) => void;
    restoreData: () => void;
    setAnimReorder: (
        animReorder: Partial<{ sidebar: boolean; preview: boolean }>,
    ) => Promise<void>;
};

export type Store = UseBoundStore<StoreApi<StoreState>>;

type EditorContextValue = {
    store: Store;
    iconsUrl: string;
    previewUrl: string;
    showCloseButton: boolean;
    rootElement: HTMLElement & { pasteData?: boolean };
};

const EditorContext = createContext<EditorContextValue>(
    {} as EditorContextValue,
);

type EditorContextProviderProps = {
    iconsUrl: string;
    blocks: ComponentDefinition[];
    data: ComponentValue[];
    previewUrl: string;
    children?: ReactNode;
    showCloseButton: boolean;
    editorOptions?: Partial<EditorOptions>;
    rootElement: HTMLElement & { pasteData?: boolean };
};

export const EditorContextProvider = ({
    editorOptions,
    blocks: blocks,
    iconsUrl,
    previewUrl,
    children,
    data: data,
    rootElement,
    showCloseButton,
}: EditorContextProviderProps) => {
    const store = create(
        combine(
            {
                blocks: blocks,
                editorOptions: {
                    ...defaultEditorOptions,
                    ...editorOptions,
                } as EditorOptions,
                showCloseButton: showCloseButton,
                data: data,
                storedData: data,
                animReorder: { sidebar: false, preview: false },
                blocksOrder: [] as string[],
                requiredIds: [] as string[],
                focusIndex: null as number | null,
                insertIndex: null as number | null,
                rootElement: rootElement,
            },
            (set, getState) => {
                return {
                    setInsertIndex: (index: number | null) => {
                        if (
                            index !== null &&
                            !getState().editorOptions.allowAdd
                        ) {
                            return;
                        }
                        set({ insertIndex: index });
                    },
                    insertData: (block: ComponentDefinition) => {
                        const { data, insertIndex } = getState();

                        const newBlockData = getFieldsDefaultValues(block.fields);

                        const finalInsertIndex = insertIndex ?? data.length;

                        set({
                            data: insertIntoArray(data, finalInsertIndex, {
                                _name: block.name,
                                _id: uuid(),
                                data: newBlockData,
                            }),
                            focusIndex: finalInsertIndex,
                        });
                    },
                    updateData: async (v: unknown, path: string) => {
                        const { data } = getState();
                        const keys = path.split(".");

                        set({
                            data: setDeepValue(data, keys, v),
                        });
                    },
                    moveBlock: (
                        fromIndex: number,
                        toIndex: number,
                        setFocus: boolean = false,
                    ) => {
                        if (!getState().editorOptions.reorderable) {
                            return;
                        }

                        if (setFocus && fromIndex == getState().focusIndex) {
                            set({ focusIndex: toIndex });
                        }

                        set((state) => {
                            const newData = arrayMove(
                                state.data,
                                fromIndex,
                                toIndex,
                            );

                            return {
                                data: newData,
                                blocksOrder: newData.map((v) => v._id),
                            };
                        });
                    },
                    setAnimReorder: (
                        opt: Partial<{ sidebar: boolean; preview: boolean }>,
                    ) => {
                        set({
                            animReorder: { ...getState().animReorder, ...opt },
                        });

                        return Promise.resolve();
                    },
                    removeData: (id: string) => {
                        const { data, requiredIds } = getState();
                        const index = data.findIndex((b) => b._id === id);

                        if (index !== -1 && !requiredIds.includes(id)) {
                            window.sessionStorage.setItem(
                                "ve-data",
                                JSON.stringify(data),
                            );
                            const newData = deleteFromArray(data, index);
                            set({ data: newData, storedData: data });
                        }
                    },
                    getIndexById: (id: string) => {
                        const { data } = getState();
                        return data.findIndex((b) => b._id === id);
                    },
                    setFocusIndex: (index: number | null) => {
                        set({ focusIndex: index });
                    },
                    restoreData: () => {
                        const storedData = getState().storedData;
                        set({ data: storedData });
                    },
                };
            },
        ),
    );

    // A name listed N times in requiredBlocks requires N instances of that block.
    const requiredCounts = new Map<string, number>();
    store.getState().editorOptions.requiredBlocks.forEach((n) => {
        requiredCounts.set(n, (requiredCounts.get(n) ?? 0) + 1);
    });
    const presentCounts = new Map<string, number>();
    data.forEach((b) => {
        presentCounts.set(b._name, (presentCounts.get(b._name) ?? 0) + 1);
    });
    requiredCounts.forEach((required, n) => {
        const definition = blocks.find((b) => b.name === n);
        if (!definition) {
            return;
        }
        for (let i = presentCounts.get(n) ?? 0; i < required; i++) {
            store.getState().insertData(definition);
        }
    });

    // Only the instances that satisfy the requirement are protected;
    // blocks added afterwards from the library stay deletable.
    const remaining = new Map(requiredCounts);
    const requiredIds: string[] = [];
    store.getState().data.forEach((b) => {
        const left = remaining.get(b._name) ?? 0;
        if (left > 0) {
            requiredIds.push(b._id);
            remaining.set(b._name, left - 1);
        }
    });
    store.setState({
        focusIndex: null,
        insertIndex: null,
        requiredIds,
        storedData: store.getState().data,
    });

    return (
        <EditorContext.Provider
            value={{
                store: store,
                iconsUrl: iconsUrl,
                previewUrl: previewUrl,
                rootElement: rootElement,
                showCloseButton: showCloseButton,
            }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error(
            "useEditorContext must be used within EditorContextProvider",
        );
    }
    return context;
};

export function usePartialStore(...keys: (keyof StoreState)[]) {
    const { store } = useEditorContext();
    return Object.fromEntries(
        keys.map((k) => [k, useStore(store, (state) => state[k])]),
    ) as Pick<StoreState, (typeof keys)[number]>;
}

export function useBlocksLibraryVisible() {
    const { insertIndex } = usePartialStore("insertIndex");
    return insertIndex !== null;
}

export function useBlockData(id: string) {
    const { store } = useEditorContext();
    return (
        useStore(store, (state) => state.data.find((b) => b._id == id)) || {
            _id: id,
            _name: "",
            data: {},
        }
    );
}

export function useBlockDefinition(name: string) {
    const { store } = useEditorContext();
    return useStore(store, (state) =>
        state.blocks.find((b) => b.name === name),
    );
}

export function useDataGetter(): () => ComponentValue[] {
    const context = useContext(EditorContext);
    return () => context.store?.getState().data ?? [];
}
