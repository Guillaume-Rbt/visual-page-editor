import { createContext, type ReactNode, useContext } from "react";
import { create, useStore, UseBoundStore, StoreApi } from "zustand";
import { BlocDefinition } from "./types";
import { combine } from "zustand/middleware";

type StoreState = {
  blocs: BlocDefinition[];
  value: Record<string, any>;
  setValue: (id: string, name: string, value: any) => void;
};

export type Store = UseBoundStore<StoreApi<StoreState>>;

type EditorContextValue = {
  store: Store;
};

const EditorContext = createContext<EditorContextValue>(
  {} as EditorContextValue,
);

type EditorContextProviderProps = {
  blocs: BlocDefinition[];
  children?: ReactNode;
};

export const EditorContextProvider = ({
  blocs,
  children,
}: EditorContextProviderProps) => {
  const store = create(
    combine(
      {
        blocs: blocs,
        value: {} as Record<string, any>,
      },
      (set, getState) => {
        return {
          setValue: (id: string, name: string, value: any) => {},
        };
      },
    ),
  );

  return (
    <EditorContext.Provider value={{ store: store }}>
      {children}
    </EditorContext.Provider>
  );
};

const useEditorContext = () => {
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

