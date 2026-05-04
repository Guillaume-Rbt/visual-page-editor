import { BlocDefinition } from "./types";
import { createRoot } from "react-dom/client";
import { VisualEditor as VisualEditorComponent } from "./VisualEditor";
import { EditorContextProvider, usePartialStore } from "./Store";
import { Translation } from "./types";
import { fr as FR } from "./langs/fr";
import "./assets/css/app.css";
import "virtual:uno.css";

const blocs: BlocDefinition[] = [];

class VisualEditor {
    static lang: Translation = FR;

    constructor(options: { lang?: Translation; name?: string } = {}) {
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
            name = "content";

            constructor() {
                super();
            }

            connectedCallback() {
                this.value = JSON.parse(this.getAttribute("value") ?? "[]");
                this.name = this.getAttribute("name") || "content";

                this.root = createRoot(this);
                this.root.render(
                    <EditorContextProvider
                        iconsUrl={this.getAttribute("iconsUrl") || "./icons"}
                        blocs={blocs}
                        value={this.value}>
                        <VisualEditorComponent />
                        <HiddenTextarea name={this.name} />
                    </EditorContextProvider>,
                );
            }

            attributesChangedCallback(name: string, oldValue: string, newValue: string) {}

            disconnectedCallback() {
                this.root?.unmount();
            }
        }
        customElements.define(name, Element);
    }
}

function HiddenTextarea({ name = "content" }) {
    const { value } = usePartialStore("value");

    return <textarea readOnly hidden name={name} value={JSON.stringify(value)}></textarea>;
}
export { VisualEditor, blocs };
export { defineField, translation } from "./utils/utils";

// FIELD EXPORTS

export { Text } from "./components/fields/Text";
