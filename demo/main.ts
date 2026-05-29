import { Repeater, Text, VisualEditor } from "../src/visual-editor";

const visualEditor = new VisualEditor();

visualEditor.defineElement("ve-editor");

visualEditor.registerBloc({
    name: "hero",
    label: "Hero",
    category: "hero",
    fields: [
        Text("siteTitle", {
            label: "Titre du site",
            multiline: false,
            placeholder: "Titre",
        }),
        Text("siteDescription", {
            label: "Description du site",
            multiline: true,
        }),
        Repeater("actions", {
            label: "Actions",
            itemLabel: "label",
            fields: [
                Text("label", {
                    label: "Label du bouton",
                    multiline: false,
                    placeholder: "Call to action",
                }),
                Text("type", {
                    label: "Type",
                    multiline: false,
                    placeholder: "Type",
                    defaultValue: "primary"
                }),
            ],
        }),
    ],
});
