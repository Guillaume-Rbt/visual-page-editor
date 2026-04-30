import { BlocDefinition } from "./types";
import { createRoot } from "react-dom/client";
import { VisualEditor as VisualEditorComponent } from "./VisualEditor";
import { EditorContextProvider } from "./Store";
import { Translation } from "./types";
import { fr as FR } from "./langs/fr";
import "./assets/css/app.css";
import "virtual:uno.css";

const blocs: BlocDefinition[] = [];

class VisualEditor {
  static lang: Translation = FR;

  constructor(options: { lang?: Translation } = {}) {
    VisualEditor.lang = options.lang || FR;
  }

  registerBloc(options: BlocDefinition) {
    blocs.push(options);

    return this;
  }

  defineElement(name = "visual-editor") {
    class Element extends HTMLElement {
      root: ReturnType<typeof createRoot> | null = null;
      value = [];

      constructor() {
        super();
      }

      connectedCallback() {
        this.value = JSON.parse(this.getAttribute("value") ?? "[]");

        this.root = createRoot(this);
        this.root.render(
          <EditorContextProvider
            iconsUrl={this.getAttribute("iconsUrl") || "./icons"}
            blocs={blocs}
            value={this.value}
          >
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

export { VisualEditor, blocs };
export { defineField, translation } from "./utils/utils";

// FIELD EXPORTS

export { Text } from "./components/fields/Text";
