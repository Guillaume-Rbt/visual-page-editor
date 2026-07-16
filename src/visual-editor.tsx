import { ComponentDefinition, Device } from "./types";
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

const components: ComponentDefinition[] = [];

class VisualEditor {
    static lang: Translation = FR;
    static devices: Device[] = defaultDevices;
    root = null as unknown as Root;

    constructor(options: { lang?: Translation; devices?: Device[]; name?: string } = {}) {
        VisualEditor.lang = options.lang ?? FR;
        VisualEditor.devices = options.devices ?? defaultDevices;
    }

    registerBlock(options: ComponentDefinition) {
        components.push({ usableInSlot: false, ...options });

        return this;
    }

    defineElement(name = "visual-editor") {
        class Element extends HTMLElement {
            root = null as unknown as Root;
            data = [];
            name = "content";
            urlPreview = "/preview";

            static get observedAttributes() {
                return ["previewUrl", "value", "iconsUrl", "shown"];
            }

            constructor() {
                super();
            }

            connectedCallback() {
                this.data = JSON.parse(this.getAttribute("value") ?? "[]");
                this.name = this.getAttribute("name") ?? "content";
                this.urlPreview = this.getAttribute("urlPreview") ?? "";

                if (!this.root) {
                    this.root = createRoot(this);
                }

                this.render();
            }

            attributeChangedCallback(name: string, oldValue: string, newValue: string) {
                console.log("attributeChangedCallback", name, oldValue, newValue);
                if (oldValue == newValue) {
                    return;
                }
                switch (name) {
                    case "previewUrl":
                        this.urlPreview = this.getAttribute("previewUrl") ?? "";
                        break;
                    case "shown":
                        this.render();
                        break;
                }

                this.render();
            }

            render() {
                if (!this.root) {
                    this.root = createRoot(this);
                }

                this.root.render(
                    <EditorContextProvider
                        rootElement={this}
                        urlPreview={this.urlPreview}
                        iconsUrl={this.getAttribute("iconsUrl") || "./icons"}
                        blocks={components}
                        data={this.data}>
                        <VisualEditorComponent visible={this.getAttribute("shown") === "true"} />
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

export { VisualEditor, components as blocks };
export { defineField, translation, ref } from "./utils/utils";
export { FieldsRenderer } from "./components/sidebar/FieldsRenderer";
export { FR };

// FIELD EXPORTS

export { Checkbox } from "./components/fields/Checkbox";
export { Color } from "./components/fields/Color";
export { Column } from "./components/fields/Column";
export { HTMLText } from "./components/fields/HTMLText";
export { NumberField as Number } from "./components/fields/Number";
export { Repeater } from "./components/fields/Repeater";
export { Row } from "./components/fields/Row";
export { Select } from "./components/fields/Select";
export { Slot } from "./components/fields/Slot";
export { Tabs } from "./components/fields/Tabs";
export { Text } from "./components/fields/Text";
