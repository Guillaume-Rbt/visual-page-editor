import { Text, VisualEditor } from "../src/visual-editor";

const visualEditor = new VisualEditor();

visualEditor.defineElement("ve-editor");

visualEditor
  .registerBloc({
    name: "Test bloc",
    category: "test",
    fields: [
      Text("text-field", {
        label: "Text Field",
        description: "This is a text field",
        multiline: true,
        defaultValue: "Default value",
      }),
    ],
  })
  .registerBloc({
    name: "Test bloc 2",
    category: "test",
    fields: [
      Text("text-field", {
        label: "Text Field",
        description: "This is a text field",
        multiline: true,
        defaultValue: "Default value",
      }),
    ],
  });
