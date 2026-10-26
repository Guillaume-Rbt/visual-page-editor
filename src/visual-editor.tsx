import { ComponentDefinition, ComponentValue, Device } from "./types";
import { createRoot } from "react-dom/client";
import { VisualEditor as VisualEditorComponent } from "./VisualEditor";
import { EditorContextProvider, usePartialStore } from "./Store";
import type { EditorOptions } from "./Store";
import { Translation } from "./types";
import { fr as FR } from "./langs/fr";
import "./assets/css/app.css";
import "virtual:uno.css";
import { ToastProvider } from "./components/ui/Toast";
import type { Root } from "react-dom/client";
import { v4 as uuidv4 } from "uuid";

const defaultDevices: Device[] = [
    { name: "Mobile", type: "mobile", size: [390, 900] },
    { name: "Desktop", type: "desktop", size: ["100%", "100%"], default: true },
];

const components: ComponentDefinition[] = [];

const isValidData = (data: any): data is ComponentValue[] => {
    return (
        Array.isArray(data) &&
        data.every(
            (item) =>
                typeof item === "object" &&
                item !== null &&
                "_id" in item &&
                "_name" in item,
        )
    );
};

class VisualEditor {
    static lang: Translation = FR;
    static devices: Device[] = defaultDevices;
    id = uuidv4();
    blocks: ComponentDefinition[] = components;
    editorOptions: Partial<EditorOptions>;

    constructor(
        options: {
            lang?: Translation;
            devices?: Device[];
            reorderable?: boolean;
            requiredBlocks?: string[];
            allowAdd?: boolean;
        } = {},
    ) {
        VisualEditor.lang = options.lang ?? FR;
        VisualEditor.devices = options.devices ?? defaultDevices;
        this.editorOptions = {
            reorderable: options.reorderable ?? true,
            requiredBlocks: options.requiredBlocks ?? [],
            allowAdd: options.allowAdd ?? true,
        };
    }

    registerBlock(options: ComponentDefinition, instanceBlock = false) {
        const array = [...this.blocks];

        const canAdd = !array.some((block) => block.name === options.name);

        if (!canAdd) {
            console.warn(`Block with name "${options.name}" already exists.`);
            return this;
        }

        this.blocks.push({ usableInSlot: false, ...options });

        if (!instanceBlock) {
            components.push({ usableInSlot: false, ...options });
        }

        return this;
    }

    defineElement(name = "visual-editor") {
        const instance = this;

        class Element extends HTMLElement {
            root = null as unknown as Root;
            data = [];
            name = "content";
            urlPreview = "/preview";
            pasteData = false;
            editorInstance = instance;

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
                this.classList.add("ve-editor-element");
                if (!this.root) {
                    this.root = createRoot(this);
                }

                document.addEventListener(
                    "paste",
                    this.handlePasteData.bind(this),
                );
                document.addEventListener("copy", (event) => {
                    this.pasteData = false;
                });

                this.render();
            }

            async handlePasteData() {
                if (this.pasteData) {
                    await navigator.clipboard.readText().then((text) => {
                        const pasteData = JSON.parse(text);

                        if (!isValidData(pasteData)) {
                            console.error("Invalid data format for paste");
                            return;
                        }

                        this.data = JSON.parse(text);

                        this.render();
                    });
                }
            }

            attributeChangedCallback(
                name: string,
                oldValue: string,
                newValue: string,
            ) {
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

                const shownAttribute = this.getAttribute("shown");

                const isShown =
                    shownAttribute === "true" || shownAttribute === "always";

                this.root.render(
                    <ToastProvider>
                        <EditorContextProvider
                            rootElement={this}
                            urlPreview={this.urlPreview}
                            iconsUrl={
                                this.getAttribute("iconsUrl") || "./icons"
                            }
                            blocks={this.editorInstance.blocks}
                            editorOptions={this.editorInstance.editorOptions}
                            data={this.data}
                            showCloseButton={shownAttribute !== "always"}>
                            <VisualEditorComponent
                                visible={isShown !== false}
                            />
                            <HiddenTextarea name={this.name} />
                        </EditorContextProvider>
                    </ToastProvider>,
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

    return (
        <textarea
            readOnly
            hidden
            name={name}
            value={JSON.stringify(data)}></textarea>
    );
}

export { VisualEditor, components as blocks };
export { defineField, translation, ref } from "./utils/utils";
export { FieldsRenderer } from "./components/sidebar/FieldsRenderer";
export { FR };

// FIELD EXPORTS

export { Checkbox } from "./components/fields/Checkbox";
export { Color } from "./components/fields/Color";
export { Column } from "./components/fields/Column";
export { Field } from "./components/fields/Field";
export { File } from "./components/fields/File";
export { Group } from "./components/fields/Group";
export { HTMLText } from "./components/fields/HTMLText";
export { NumberField as Number } from "./components/fields/Number";
export { Radio } from "./components/fields/Radio";
export { Range } from "./components/fields/Range";
export { Repeater } from "./components/fields/Repeater";
export { Row } from "./components/fields/Row";
export { Select } from "./components/fields/Select";
export { Slot } from "./components/fields/Slot";
export { Tabs } from "./components/fields/Tabs";
export { Text } from "./components/fields/Text";
