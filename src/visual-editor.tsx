import { BlocDefinition } from "./types";
import { createRoot } from "react-dom/client";
import { VisualEditor as VisualEditorComponent } from "./VisualEditor";
import { EditorContextProvider } from "./Store";
import { Translation } from "./types";
import { fr as FR } from "./langs/fr";
import "./assets/css/app.css";
import "virtual:uno.css";

import { Text } from "./components/fields/Text";

const blocs: BlocDefinition[] = [];

class VisualEditor {
  static lang: Translation = FR;

  constructor(options: { lang?: Translation } = {}) {
    VisualEditor.lang = options.lang || FR;
  }

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
          </EditorContextProvider>,
        );
      }

      attributesChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {}

      disconnectedCallback() {
        this.root?.unmount();
      }
    }
    customElements.define(name, Element);
  }
}

export { VisualEditor };

// FIELD EXPORTS

export { Text };
