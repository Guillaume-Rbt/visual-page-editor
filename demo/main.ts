import { Repeater, Text, VisualEditor, Slot, Tabs, Row } from "../src/visual-editor";

const visualEditor = new VisualEditor();

visualEditor.defineElement("ve-editor");

visualEditor
    .registerBloc({
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
            Slot("content", {
                label: "Contenu du hero",
            }),
            Repeater("actions", {
                label: "Actions",
                itemLabel: "Bouton {{id}}",
                fields: [
                    Row({
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
                                defaultValue: "primary",
                            }),
                        ],
                        name: "ggg",
                    }),
                ],
            }),
            Tabs([
                {
                    name: "Contenu",
                    fields: [
                        Text("left", {
                            label: "Contenu",
                            multiline: true,
                        }),
                    ],
                },
                {
                    name: "Apparence",
                    fields: [
                        Text("right", {
                            label: "Contenu",
                            multiline: true,
                        }),
                    ],
                },
            ]),
        ],
    })
    .registerBloc({
        name: "text",
        label: "Texte",
        category: "content",
        usableInSlot: true,
        fields: [
            Text("content", {
                label: "Contenu",
                multiline: true,
            }),
            Tabs([
                {
                    name: "test",
                    useTabNameAsKey: true,
                    fields: [
                        Text("left", {
                            label: "Contenu",
                            multiline: true,
                        }),
                    ],
                },
                {
                    name: "test 2",
                    fields: [
                        Text("right", {
                            label: "Contenu",
                            multiline: true,
                        }),
                    ],
                },
            ]),
        ],
    });
