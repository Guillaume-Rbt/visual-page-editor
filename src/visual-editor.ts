import { BlocDefinition } from "./types";
import { createRoot } from "react-dom/client";
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
        console.log("Connected to DOM");
        this.root = createRoot(this);
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
