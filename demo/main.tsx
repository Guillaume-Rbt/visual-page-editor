import {
    Repeater,
    Text,
    VisualEditor,
    Tabs,
    File,
    Color,
    Number,
    HTMLText,
    Checkbox,
    translation,
    Radio,
} from "../src/visual-editor";

// @ts-ignore
import "files-manager/style.css";
import { FilesManager, FilesManagerElement } from "files-manager";

const filesManager = new FilesManager();

filesManager.defineElement();

const visualEditor = new VisualEditor();

visualEditor.defineElement("ve-editor");

const fmElement = document.querySelector(
    "files-manager",
) as FilesManagerElement;

visualEditor
    .registerBlock({
        name: "hero",
        label: "Hero",
        category: translation("heroCategory"),
        fields: [
            Text("eyebrow", {
                label: "Surtitre",
                defaultValue: "Visual Page Editor",
            }),
            Text("siteTitle", {
                label: "Titre",
                defaultValue: "Construisez vos pages visuellement",
            }),
            HTMLText("siteDescription", {
                label: "Description",
                defaultValue:
                    "<p>Composez des pages à partir de composants réutilisables, sans sacrifier la qualité du code rendu.</p>",
            }),
            Radio("layout", {
                label: "Disposition",
                layout: "row",
                defaultValue: "split",
                options: [
                    { label: "Image à droite", value: "split" },
                    { label: "Image au-dessus", value: "stacked" },
                ],
            }),
            Radio("alignment", {
                label: "Alignement du contenu",
                layout: "row",
                defaultValue: "text-start",
                options: [
                    { label: "Gauche", value: "text-start" },
                    { label: "Centre", value: "text-center" },
                    { label: "Droite", value: "text-end" },
                ],
            }),
            Color("background", {
                label: "Couleur de fond",
                colors: [
                    { value: "transparent", label: "Transparent" },
                    { value: "#f8f9fa", label: "Gris clair" },
                    { value: "#e7f1ff", label: "Bleu clair" },
                    { value: "#fff3cd", label: "Jaune clair" },
                ],
                enableCustomColor: true,
                defaultValue: "#f8f9fa",
            }),
            Checkbox("showImage", {
                label: "Afficher l’image",
                defaultValue: true,
            }),
            File("backgroundImage", {
                label: "Image",
                description:
                    "Choisissez une image dans le gestionnaire ou saisissez une URL.",
                defaultValue: "/imgs/bootstrap-logo.svg",
                enabled: (data) => data.showImage,
                onBrowse: () => () => {
                    return fmElement!.open();
                },
            }),
            Text("imageAlt", {
                label: "Texte alternatif",
                description:
                    "Décrivez l’image ; laissez vide si elle est purement décorative.",
                defaultValue: "Logo Bootstrap",
                enabled: (data) => data.showImage,
            }),
            Number("imageWidth", {
                label: "Largeur de l’image",
                defaultValue: 420,
                min: 32,
                max: 960,
                suffix: " px",
                enabled: (data) => data.showImage,
            }),
            Repeater("actions", {
                label: "Actions",
                itemLabel: "label",
                addButtonLabel: "Ajouter une action",
                max: 3,
                min: 0,
                fields: [
                    Text("label", {
                        label: "Libellé",
                        defaultValue: "Commencer",
                    }),
                    Text("url", {
                        label: "Lien",
                        defaultValue: "#",
                    }),
                    Radio("style", {
                        label: "Style",
                        layout: "row",
                        defaultValue: "btn-primary",
                        options: [
                            { label: "Principal", value: "btn-primary" },
                            {
                                label: "Secondaire",
                                value: "btn-outline-secondary",
                            },
                        ],
                    }),
                ],
            }),
        ],
    })
    .registerBlock({
        name: "features",
        label: "Fonctionnalités",
        category: "Contenu",
        usableInSlot: true,
        fields: [
            Text("title", {
                label: "Titre",
                defaultValue: "Tout ce qu'il faut pour démarrer",
            }),
            HTMLText("intro", {
                label: "Introduction",
                defaultValue:
                    "<p>Une grille responsive inspirée de l’exemple Features de Bootstrap.</p>",
            }),
            Radio("columns", {
                label: "Colonnes",
                layout: "row",
                defaultValue: "3",
                options: [
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                ],
            }),
            Repeater("items", {
                label: "Fonctionnalités",
                itemLabel: "title",
                addButtonLabel: "Ajouter une fonctionnalité",
                min: 1,
                max: 8,
                fields: [
                    Text("title", {
                        label: "Titre",
                        defaultValue: "Fonctionnalité",
                    }),
                    HTMLText("description", {
                        label: "Description",
                        defaultValue:
                            "<p>Décrivez clairement le bénéfice proposé.</p>",
                    }),
                ],
            }),
        ],
    })
    .registerBlock({
        name: "pricing",
        label: "Tarifs",
        category: "Conversion",
        fields: [
            Text("title", {
                label: "Titre",
                defaultValue: "Des tarifs simples et transparents",
            }),
            HTMLText("intro", {
                label: "Introduction",
                defaultValue:
                    "<p>Choisissez l’offre qui correspond à votre projet.</p>",
            }),
            Text("currency", {
                label: "Devise",
                defaultValue: "€",
            }),
            Radio("columns", {
                label: "Colonnes",
                layout: "row",
                defaultValue: "3",
                options: [
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                ],
            }),
            Repeater("plans", {
                label: "Offres",
                itemLabel: "name",
                addButtonLabel: "Ajouter une offre",
                min: 1,
                max: 4,
                fields: [
                    Text("name", {
                        label: "Nom",
                        defaultValue: "Essentiel",
                    }),
                    Number("price", {
                        label: "Prix",
                        defaultValue: 19,
                        min: 0,
                    }),
                    Text("period", {
                        label: "Période",
                        defaultValue: "/mois",
                    }),
                    Repeater("features", {
                        label: "Avantages",
                        itemLabel: "label",
                        addButtonLabel: "Ajouter un avantage",
                        min: 1,
                        max: 8,
                        fields: [
                            Text("label", {
                                label: "Avantage",
                                defaultValue: "Support inclus",
                            }),
                        ],
                    }),
                    Checkbox("highlighted", {
                        label: "Mettre cette offre en avant",
                    }),
                    Text("buttonLabel", {
                        label: "Libellé du bouton",
                        defaultValue: "Choisir cette offre",
                    }),
                    Text("buttonUrl", {
                        label: "Lien du bouton",
                        defaultValue: "#",
                    }),
                ],
            }),
        ],
    })
    .registerBlock({
        name: "callout",
        label: "Appel à l’action",
        category: "Conversion",
        usableInSlot: true,
        fields: [
            Text("title", {
                label: "Titre",
                defaultValue: "Prêt à lancer votre prochain projet ?",
            }),
            HTMLText("content", {
                label: "Contenu",
                defaultValue:
                    "<p>Présentez votre proposition de valeur et guidez le visiteur vers l’étape suivante.</p>",
            }),
            Radio("theme", {
                label: "Thème",
                defaultValue: "bg-light text-dark",
                options: [
                    { label: "Clair", value: "bg-light text-dark" },
                    { label: "Sombre", value: "bg-dark text-white" },
                    { label: "Primaire", value: "bg-primary text-white" },
                ],
            }),
            Checkbox("showButton", {
                label: "Afficher le bouton",
                defaultValue: true,
            }),
            Text("buttonLabel", {
                label: "Libellé du bouton",
                defaultValue: "Commencer",
                enabled: (data) => data.showButton,
            }),
            Text("buttonUrl", {
                label: "Lien du bouton",
                defaultValue: "#",
                enabled: (data) => data.showButton,
            }),
            Radio("buttonStyle", {
                label: "Style du bouton",
                defaultValue: "btn-primary",
                enabled: (data) => data.showButton,
                options: [
                    { label: "Primaire", value: "btn-primary" },
                    { label: "Clair", value: "btn-light" },
                    { label: "Contour clair", value: "btn-outline-light" },
                    {
                        label: "Contour sombre",
                        value: "btn-outline-dark",
                    },
                ],
            }),
        ],
    });

const displayEditor = document.querySelector("#display-editor");

const editor = document.querySelector("ve-editor");

displayEditor?.addEventListener("click", () => {
    console.log("editor", editor);
    editor?.setAttribute("shown", "true");
});
