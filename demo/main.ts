import { Text, VisualEditor } from "../src/visual-editor";

const visualEditor = new VisualEditor();

visualEditor.defineElement("ve-editor");

visualEditor
    .registerBloc({
        name: "test-bloc",
        label: "Test bloc",
        category: "test",
        fields: [
            Text("text-field-1", {
                label: "Title 1",
                description: "",
                multiline: false,
                defaultValue: "Default value",
            }),
            Text("text-long-field-1", {
                label: "Contenu",
                description: "This is a text field",
                multiline: true,
                defaultValue: "Default value",
            }),
        ],
    })
    .registerBloc({
        name: "test-bloc-2",
        label: "Test bloc 2",
        category: "test",
        fields: [
            Text("text-field-2", {
                label: "Text Field",
                description: "This is a text field",
                multiline: true,
                defaultValue: "Default value",
            }),
        ],
    });
