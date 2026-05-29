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
            data = [];
            name = "content";
            urlPreview = "/preview";

            constructor() {
                super();
            }

            connectedCallback() {
                this.data = JSON.parse(this.getAttribute("value") ?? "[]");
                this.name = this.getAttribute("name") ?? "content";
                this.urlPreview = this.getAttribute("urlPreview") ?? "";

                this.root = createRoot(this);

                this.render();
            }

            attributesChangedCallback(name: string, oldValue: string, newValue: string) {
                switch (name) {
                    case "previewUrl":
                        if (oldValue == newValue) {
                            break;
                        }
                        this.urlPreview = this.getAttribute("previewUrl") ?? "";
                        this.render();
                        break;
                }
            }

            render() {
                this.root!.render(
                    <EditorContextProvider
                        urlPreview={this.urlPreview}
                        iconsUrl={this.getAttribute("iconsUrl") || "./icons"}
                        blocs={blocs}
                        data={this.data}>
                        <VisualEditorComponent />
                        <HiddenTextarea name={this.name} />
                    </EditorContextProvider>,
                );
            }

            disconnectedCallback() {
                this.root?.unmount();
            }
        }
        customElements.define(name, Element);
    }
}

function HiddenTextarea({ name = "content" }) {
    const { data } = usePartialStore("data");

    return <textarea readOnly hidden name={name} value={JSON.stringify(data)}></textarea>;
}
export { VisualEditor, blocs };
export { defineField, translation } from "./utils/utils";

// FIELD EXPORTS

export { Text } from "./components/fields/Text";
export { Repeater } from "./components/fields/Repeater";
