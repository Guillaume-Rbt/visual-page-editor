import { BlocDefinition } from "./types";
import { createRoot } from "react-dom/client";
import { VisualEditor as VisualEditorComponent } from "./VisualEditor";
import { EditorContextProvider } from "./Store";
import "./assets/css/app.css";
import "virtual:uno.css";


const blocs: BlocDefinition[] = [];

class VisualEditor {
  registerBloc(options: BlocDefinition) {
    blocs.push(options);
  }

  defineElement(name = "visual-editor") {
    class Element extends HTMLElement {
      root: ReturnType<typeof createRoot> | null = null;

      constructor() {
        super();
      }

      connectedCallback() {
        this.root = createRoot(this);
        this.root.render(
          <EditorContextProvider blocs={blocs}>
            <VisualEditorComponent />
          </EditorContextProvider>
        );
      }

      attributesChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {
        if (name === "open") {
        }
      }

      disconnectedCallback() {
        this.root?.unmount();
      }
    }
    customElements.define(name, Element);
  }
}
export { VisualEditor };
