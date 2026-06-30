import { BlocDefinition, Device } from "./types";
import { createRoot } from "react-dom/client";
import { VisualEditor as VisualEditorComponent } from "./VisualEditor";
import { EditorContextProvider, usePartialStore } from "./Store";
import { Translation } from "./types";
import { fr as FR } from "./langs/fr";
import "./assets/css/app.css";
import "virtual:uno.css";
import type { Root } from "react-dom/client";

const defaultDevices: Device[] = [
    { name: "Mobile", type: "mobile", size: [390, 900] },
    { name: "Desktop", type: "desktop", size: ["100%", "100%"], default: true },
];

const blocs: BlocDefinition[] = [];

class VisualEditor {
    static lang: Translation = FR;
    static devices: Device[] = defaultDevices;
    root = null as unknown as Root;

    constructor(options: { lang?: Translation; devices?: Device[]; name?: string } = {}) {
        VisualEditor.lang = options.lang ?? FR;
        VisualEditor.devices = options.devices ?? defaultDevices;
    }

    registerBloc(options: BlocDefinition) {
        blocs.push({ usableInSlot: false, ...options });

        return this;
    }

    defineElement(name = "visual-editor") {
        class Element extends HTMLElement {
            root = null as unknown as Root;
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
export { defineField, translation, ref } from "./utils/utils";
export { FieldsRenderer } from "./components/sidebar/FieldsRenderer";
export { FR };

// FIELD EXPORTS

export { Text } from "./components/fields/Text";
export { Repeater } from "./components/fields/Repeater";
export { Slot } from "./components/fields/Slot";
export { Tabs } from "./components/fields/Tabs";
export { Row } from "./components/fields/Row";
export { Color } from "./components/fields/Color";
export { NumberField as Number } from "./components/fields/Number";
export { HTMLText } from "./components/fields/HTMLText";
