import { Repeater, Text, VisualEditor, Slot, Tabs, Row, Color, Number, HTMLText } from "../src/visual-editor";

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
            HTMLText("siteDescription", {
                label: "Description du site",
            }),
            Number("cols", {
                label: "Colonnes",
            }),
            Slot("content", {
                label: "Contenu du hero",
            }),
            Repeater("actions", {
                label: "Actions",
                itemLabel: "label",
                max: 4,
                min: 3,
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
                        Color("background", {
                            colors: [
                                "#ff0000",
                                "#4808df",
                                "#0cf575",
                                "#7f0fc0",
                                "#06e9a5",
                                "#f16d00",
                                "#f005d0",
                                "transparent",
                                "var(--colors-primary)",
                            ],
                            label: "Fond",
                            defaultValue: "",
                        }),
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
