import { createContext, type ReactNode, useContext } from "react";
import { create, useStore, UseBoundStore, StoreApi } from "zustand";
import { ComponentDefinition, ComponentValue, FieldDefinition } from "./types";
import { combine } from "zustand/middleware";
import { deleteFromArray, insertIntoArray, setDeepValue } from "./utils/utils";
import { v4 as uuid } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

type StoreState = {
    blocks: ComponentDefinition[];
    data: ComponentValue[];
    blocksOrder: string[];
    insertIndex: number | null;
    setInsertIndex: (index: number | null) => void;
    insertData: (block: ComponentDefinition) => void;
    updateData: (v: unknown, path: string) => void;
    moveBlock: (fromIndex: number, toIndex: number) => void;
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
    blocks: ComponentDefinition[];
    data: ComponentValue[];
    urlPreview: string;
    children?: ReactNode;
    rootElement: HTMLElement;
};

export const EditorContextProvider = ({
    blocks: blocks,
    iconsUrl,
    urlPreview,
    children,
    data: data,
    rootElement,
}: EditorContextProviderProps) => {
    const store = create(
        combine(
            {
                blocks: blocks,
                data: data,
                blocksOrder: [] as string[],
                insertIndex: null as number | null,
                rootElement: rootElement,
            },
            (set, getState) => {
                return {
                    setInsertIndex: (index: number | null) => {
                        set({ insertIndex: index });
                    },
                    insertData: (block: ComponentDefinition) => {
                        const { data, insertIndex } = getState();

                        const newBlockData = {} as Record<string, any>;

                        block.fields.forEach((field) => {
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
                                            newBlockData[f.parent] ??= {};
                                            newBlockData[f.parent][f.field.name] = f.field.options.defaultValue;
                                            return;
                                        }

                                        newBlockData[f.name] = f.options.defaultValue;
                                    },
                                );

                                return;
                            }

                            newBlockData[field.name!] = field.options.defaultValue;
                        });

                        set({
                            data: insertIntoArray(data, insertIndex ?? data.length, {
                                _name: block.name,
                                _id: uuid(),
                                data: newBlockData,
                            }),
                        });
                    },
                    updateData: (v: unknown, path: string) => {
                        const { data } = getState();
                        const keys = path.split(".");
                        set({ data: setDeepValue(data, keys, v) });
                    },
                    moveBlock: (fromIndex: number, toIndex: number) => {
                        set((state) => {
                            const newData = arrayMove(state.data, fromIndex, toIndex);

                            return {
                                data: newData,
                                blocksOrder: newData.map((v) => v._id),
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
    return useStore(store, (state) => state.blocks.find((b) => b.name === name));
}

export function useDataGetter(): () => ComponentValue[] {
    const context = useContext(EditorContext);
    return () => context.store?.getState().data ?? [];
}
