import {
    Repeater,
    Text,
    VisualEditor,
    Slot,
    Tabs,
    Column,
    Color,
    Number,
    HTMLText,
    ref,
    Checkbox,
    Select,
    Range,
    translation,
    Radio,
    Group,
    Row,
} from "../src/visual-editor";

const visualEditor = new VisualEditor();

visualEditor.defineElement("ve-editor");

async function getData() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.map((item: any) => ({
        value: item.title,
        render: () => item.title,
    }));
}

visualEditor
    .registerBlock({
        name: "hero",
        label: "Hero",
        category: translation("heroCategory"),
        fields: [
            Group("button", {
                label: "Button",
                fields: [
                    Text("label", {
                        label: "Label du bouton",
                        multiline: false,
                        defaultValue: "Call to action",
                    }),
                    Text("class", {
                        label: "Classe du bouton",
                        multiline: false,
                    }),
                ],
            }),
            Radio("alignment", {
                label: "Alignement",
                collapsed: false,
                layout: "row",
                options: [
                    {
                        tooltip: "test",
                        value: "left",
                        label: "Gauche",
                    },
                    { label: () => "Centre", value: "center" },
                    { label: () => "Droite", value: "right" },
                ],
                defaultValue: "left",
            }),
            Range("width", {
                label: "Largeur",
                min: 1,
                max: 12,
                step: 1,
                defaultValue: { min: 1, max: 12 },
            }),
            Select("articles", {
                label: "Colonnes",
                options: getData(),
            }),
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
                max: ref<number>("cols"),
                min: 0,
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
                    }),
                ],
            }),
            Checkbox("showTitle", {
                label: "Afficher le titre",
                defaultValue: true,
            }),
            Tabs([
                {
                    name: "Contenu",
                    fields: [
                        Color("background", {
                            colors: [
                                "transparent",
                                "#ff0000",
                                "#4808df",
                                "#0cf575",
                                "#7f0fc0",
                                "#06e9a5",
                                "#f16d00",
                                "#f005d0",
                                "var(--colors-ve-primary)",
                            ],
                            enableCustomColor: true,
                            label: "Fond",
                            defaultValue: "#ff0000",
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
    .registerBlock({
        name: "text",
        label: "Texte",
        category: translation("contentCategory"),
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

const displayEditor = document.querySelector("#display-editor");

const editor = document.querySelector("ve-editor");

displayEditor?.addEventListener("click", () => {
    console.log("editor", editor);
    editor?.setAttribute("shown", "true");
});
