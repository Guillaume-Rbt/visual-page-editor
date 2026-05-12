import { Text, VisualEditor } from "../src/visual-editor";

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
            defaultValue: "",
        }),
    ],
});
