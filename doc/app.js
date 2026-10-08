const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const menuToggle = document.querySelector("#menu-toggle");
const sidebar = document.querySelector("#sidebar");
const backdrop = document.querySelector("#backdrop");
const navLinks = [...document.querySelectorAll(".sidebar a")];
const languageButtons = [...document.querySelectorAll("[data-language]")];

const english = new Map(
    Object.entries({
        "Aller au contenu": "Skip to content",
        "Premiers pas": "Getting started",
        Présentation: "Overview",
        "Mise en place": "Setup",
        "Endpoint d’aperçu": "Preview endpoint",
        "Déclarer un block": "Register a block",
        "Options communes": "Common options",
        "Tous les fields": "All fields",
        "Créer un field": "Create a field",
        Traductions: "Translations",
        "Format des données": "Data format",
        "Éditeur visuel composable": "Composable visual editor",
        "Construisez l’interface d’édition qui correspond à vos composants.":
            "Build the editing interface that fits your components.",
        "Visual Page Editor fournit un Web Component, une bibliothèque de fields et un aperçu serveur. Vous déclarez vos blocks ; l’éditeur produit une structure JSON prête à être rendue par votre application.":
            "Visual Page Editor provides a Web Component, a field library, and server-rendered previews. You register your blocks; the editor produces a JSON structure ready for your application to render.",
        Commencer: "Get started",
        "Explorer les fields": "Explore fields",
        "helpers documentés": "documented helpers",
        "intégrable dans un formulaire": "embeddable in a form",
        "aperçu multi-appareils": "multi-device preview",
        "Installer la librairie": "Install the library",
        "Le package publie un module ES et une feuille de style. Node.js et npm sont nécessaires pour l’installation.":
            "The package ships an ES module and a stylesheet. Node.js and npm are required for installation.",
        "Pour travailler directement depuis le dépôt :":
            "To work directly from the repository:",
        "Styles requis.": "Required styles.",
        Importez: "Import",
        "la classe, les fields et la feuille de style.":
            "the class, fields, and stylesheet.",
        Enregistrez: "Register",
        "vos blocks avec": "your blocks with",
        Déclarez: "Define",
        "le Custom Element avec": "the Custom Element with",
        Insérez: "Insert",
        "l’élément dans une page, idéalement dans un formulaire.":
            "the element into a page, ideally inside a form.",
        "Initialiser l’éditeur": "Initialize the editor",
        "Attributs du Web Component": "Web Component attributes",
        Attribut: "Attribute",
        Rôle: "Purpose",
        "Valeur par défaut": "Default value",
        "Nom du": "Name of the",
        "généré pour la soumission du JSON.":
            "generated for submitting the JSON.",
        "Tableau JSON initial des blocks. Doit être un JSON valide.":
            "Initial JSON block array. It must be valid JSON.",
        "L’éditeur est visible uniquement quand la valeur vaut exactement":
            "The editor is visible only when the value is exactly",
        masqué: "hidden",
        "URL appelée en POST pour rendre un block ou la page complète.":
            "URL called with POST to render one block or the complete page.",
        "chaîne vide dans l’élément connecté":
            "empty string in the connected element",
        "Patron d’URL des icônes de blocks ;": "Block icon URL pattern;",
        "est remplacé par leur nom.": "is replaced with the block name.",
        "Le bouton « Enregistrer » est un bouton de soumission. Placez donc l’éditeur dans un":
            "The Save button submits the form. Place the editor inside a",
        "pour recevoir le JSON dans le champ caché.":
            "to receive JSON through the hidden field.",
        Aperçu: "Preview",
        "Implémenter l’endpoint de rendu": "Implement the rendering endpoint",
        "L’éditeur envoie du JSON avec": "The editor sends JSON using",
        "Une requête de block contient un objet ; une requête de page contient le tableau complet. La réponse attendue est du HTML.":
            "A block request contains one object; a page request contains the complete array. The expected response is HTML.",
        Sécurité: "Security",
        "Le field": "The",
        "produit du HTML. Assainissez-le côté serveur selon votre politique avant de l’afficher sur un site public.":
            "field produces HTML. Sanitize it on the server according to your policy before displaying it on a public website.",
        "Déclarer un composant éditable": "Register an editable component",
        "Options de": "Options for",
        Option: "Option",
        Type: "Type",
        Description: "Description",
        "Identifiant technique écrit dans": "Technical identifier written to",
        "et envoyé au renderer.": "and sent to the renderer.",
        "Nom affiché dans la bibliothèque.": "Name displayed in the library.",
        "Liste des fields et groupes éditables.":
            "List of editable fields and groups.",
        "Catégorie de classement dans la bibliothèque.":
            "Category used to organize the block library.",
        "Autorise le block dans un": "Allows the block inside a",
        Défaut: "Default:",
        Configuration: "Configuration",
        "Options communes aux fields": "Options shared by fields",
        "ajoute automatiquement": "automatically adds",
        "et fusionne les valeurs par défaut. Toutes les options peuvent aussi être une promesse, une fonction dérivée des données du block ou":
            "and merges default values. Every option may also be a promise, a function derived from block data, or",
        "une référence créée avec": "a reference created with",
        Comportement: "Behavior",
        "Libellé visible. Requis par la majorité des fields, parfois fourni par défaut à":
            "Visible label. Required by most fields and sometimes defaulted to",
        "Aide affichée sous le libellé lorsque le field utilise le wrapper":
            "Help displayed below the label when the field uses the",
        "Valeur injectée à la création d’un block.":
            "Value injected when a block is created.",
        "Désactive visuellement et fonctionnellement le field si faux.":
            "Visually and functionally disables the field when false.",
        "dépend du field": "depends on the field",
        Référence: "Reference",
        "Filtrer les fields": "Filter fields",
        "Filtrer les fields…": "Filter fields…",
        "Aucun field ne correspond à cette recherche.":
            "No fields match this search.",
        "Texte court ou zone multiligne. Valeur :":
            "Short text or multiline input. Value:",
        "Texte d’aide.": "Help text.",
        "Nombre avec boutons d’incrémentation. Valeur :":
            "Number with increment controls. Value:",
        "Libellé.": "Label.",
        "Pas, défaut": "Step, default",
        "Interrupteur booléen. Valeur :": "Boolean toggle. Value:",
        "Palette et sélecteur de couleur optionnel. Valeur :":
            "Palette with an optional custom color picker. Value:",
        ou: "or",
        défaut: "default",
        "Chemin texte avec bouton de navigateur de fichiers. Valeur :":
            "Text path with a file browser button. Value:",
        "La valeur n’est modifiée que si le résultat n’est pas nul.":
            "The value changes only when the result is not null.",
        "Liste de choix, synchrone ou chargée par promesse. Valeur : type de l’option.":
            "Choice list, synchronous or promise-based. Value: the option value type.",
        "Choix exclusif, en ligne ou colonne. Valeur :":
            "Exclusive choice laid out in a row or column. Value:",
        "Tableau de": "Array of",
        "accepte un nœud, un": "accepts a node, an",
        "une fonction de l’état ou": "a state function, or",
        "Curseur simple ou double. Valeur :":
            "Single or dual-thumb slider. Value:",
        "Borne basse, défaut technique": "Lower bound, technical default",
        "Borne haute, défaut technique": "Upper bound, technical default",
        "Nombre ou objet ; un objet active deux poignées.":
            "Number or object; an object enables two thumbs.",
        "Éditeur HTML riche basé sur Tiptap. Valeur : chaîne HTML.":
            "Tiptap-based rich HTML editor. Value: HTML string.",
        "Configuration complète de la barre (voir ci-dessous).":
            "Complete toolbar configuration (see below).",
        "Valeurs de": "Values for",
        "Contrôles unitaires :": "Individual controls:",
        "Raccourcis avec valeurs prédéfinies :":
            "Shortcuts with predefined values:",
        "Listes personnalisées :": "Custom lists:",
        "Collection ordonnable d’objets. Chaque item reçoit un":
            "Sortable object collection. Each item receives an",
        "Fields de chaque item.": "Fields for each item.",
        "Chemin profond comme": "Deep path such as",
        "ou texte contenant": "or text containing",
        "Défaut traduit par la clé": "Default translated from the key",
        "Emplacement pour un block dont": "Slot for a block whose",
        "vaut vrai. Valeur :": "is true. Value:",
        "Libellé requis.": "Required label.",
        "Regroupe des fields sous une propriété objet.":
            "Groups fields under an object property.",
        "Fields enfants, défaut": "Child fields, default",
        "Construit automatiquement depuis les valeurs par défaut enfants.":
            "Built automatically from child default values.",
        "Groupe de présentation : aligne plusieurs fields sur une grille sans ajouter de niveau aux données.":
            "Presentation group that aligns fields in a grid without adding a data level.",
        "Fields enfants.": "Child fields.",
        "Valeur CSS de": "CSS value for",
        "par défaut une colonne égale par field.":
            "by default, one equal column per field.",
        "Supprime l’espace entre colonnes.": "Removes the column gap.",
        "Titre du groupe.": "Group title.",
        "Alias de": "Alias for",
        "Fields enfants empilés.": "Stacked child fields.",
        "Répartit les fields dans des onglets, avec données à plat ou imbriquées.":
            "Splits fields into tabs with flat or nested data.",
        "Libellé d’onglet.": "Tab label.",
        "Fields de l’onglet.": "Fields in the tab.",
        "Imbrique les valeurs sous une clé si vrai.":
            "Nests values under a key when true.",
        "Clé d’imbrication ; sinon": "Nesting key; otherwise",
        "Wrapper React de bas niveau exporté pour construire un field personnalisé ; ce n’est pas une définition à placer directement dans":
            "Low-level React wrapper exported for custom fields; it is not a definition to place directly inside",
        "Aide.": "Help.",
        "État visuel, défaut vrai.": "Visual state, true by default.",
        "Contrôle React rendu.": "Rendered React control.",
        Extension: "Extension",
        "Créer un field avec": "Create a field with",
        "Un renderer reçoit": "A renderer receives",
        "et les": "and the merged",
        "fusionnées.": "options.",
        "transforme ce renderer en factory typée":
            "turns this renderer into the typed factory",
        "Valeur initiale.": "Initial value.",
        "Mettez systématiquement une valeur exploitable dans":
            "Always provide a usable value in",
        "Pour un field contenant": "For a field containing",
        "la factory construit l’objet initial à partir des valeurs par défaut enfants.":
            "the factory builds the initial object from child default values.",
        Internationalisation: "Internationalization",
        "Ajouter une traduction": "Add a translation",
        "La traduction française complète est exportée sous le nom":
            "The complete French translation is exported as",
        "Créez un objet complet en partant de cette base, surchargez les libellés voulus et passez-le au constructeur. Les clés propres à votre projet sont autorisées et deviennent accessibles via":
            "Create a complete object from this base, override the labels you need, and pass it to the constructor. Project-specific keys are allowed and become available through",
        "Le constructeur accepte aussi": "The constructor also accepts",
        "Chaque appareil a un": "Each device has a",
        "une taille": "a size",
        "une orientation facultative et éventuellement":
            "an optional orientation, and optionally",
        Données: "Data",
        "Structure produite": "Generated structure",
        "sélectionne le renderer,": "selects the renderer,",
        "stabilise l’édition et": "stabilizes editing, and",
        "contient les valeurs des fields.": "contains field values.",
        "est facultatif et porte l’identifiant HTML, les classes et le CSS personnalisé du block.":
            "is optional and stores the block HTML id, classes, and custom CSS.",
        "Documentation alignée sur le code du dépôt —":
            "Documentation aligned with the repository code —",
        "Retour en haut ↑": "Back to top ↑",
        Copier: "Copy",
    }),
);

const sourceText = new Map();
const translatedAttributes = [
    [
        document.querySelector('meta[name="description"]'),
        "content",
        {
            fr: "Documentation de Visual Page Editor : installation, configuration, fields, fields personnalisés et traductions.",
            en: "Visual Page Editor documentation: installation, configuration, fields, custom fields, and translations.",
        },
    ],
    [
        document.querySelector(".brand"),
        "aria-label",
        {
            fr: "Visual Page Editor, accueil de la documentation",
            en: "Visual Page Editor documentation home",
        },
    ],
    [
        sidebar,
        "aria-label",
        {
            fr: "Navigation de la documentation",
            en: "Documentation navigation",
        },
    ],
    [
        document.querySelector(".feature-strip"),
        "aria-label",
        {
            fr: "Points forts",
            en: "Highlights",
        },
    ],
    [
        document.querySelector("#field-search"),
        "placeholder",
        {
            fr: "Filtrer les fields…",
            en: "Filter fields…",
        },
    ],
];

let currentLanguage = "en";

function translateTextNodes(language) {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent || parent.closest("pre, code, script, style")) {
                    return NodeFilter.FILTER_REJECT;
                }
                return node.nodeValue.trim()
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            },
        },
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
        if (!sourceText.has(node)) {
            sourceText.set(node, node.nodeValue.trim().replace(/\s+/g, " "));
        }

        const source = sourceText.get(node);
        const value =
            language === "en" ? (english.get(source) ?? source) : source;
        const leading = node.nodeValue.match(/^\s*/)?.[0] ?? "";
        const trailing = node.nodeValue.match(/\s*$/)?.[0] ?? "";
        node.nodeValue = `${leading}${value}${trailing}`;
    });
}

function updateControlTranslations() {
    const french = currentLanguage === "fr";
    themeToggle.setAttribute(
        "aria-label",
        root.dataset.theme === "dark"
            ? french
                ? "Activer le thème clair"
                : "Enable light theme"
            : french
              ? "Activer le thème sombre"
              : "Enable dark theme",
    );
    themeToggle.title = french ? "Changer de thème" : "Change theme";
    menuToggle.setAttribute(
        "aria-label",
        french ? "Ouvrir la navigation" : "Open navigation",
    );
}

function setLanguage(language, persist = true) {
    currentLanguage = language === "fr" ? "fr" : "en";
    root.lang = currentLanguage;
    translateTextNodes(currentLanguage);
    translatedAttributes.forEach(([element, attribute, values]) => {
        element?.setAttribute(attribute, values[currentLanguage]);
    });
    languageButtons.forEach((button) => {
        button.setAttribute(
            "aria-pressed",
            String(button.dataset.language === currentLanguage),
        );
    });
    updateControlTranslations();
    root.dataset.i18nReady = "true";
    if (persist) localStorage.setItem("ve-doc-language", currentLanguage);
}

const savedTheme = localStorage.getItem("ve-doc-theme");
const savedLanguage = localStorage.getItem("ve-doc-language");
const requestedLanguage = new URLSearchParams(window.location.search).get(
    "lang",
);
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

function setTheme(theme) {
    root.dataset.theme = theme;
    updateControlTranslations();
}

setTheme(savedTheme || preferredTheme);
setLanguage(requestedLanguage || savedLanguage || "en", false);

languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setLanguage(button.dataset.language);
        fieldSearch?.dispatchEvent(new Event("input"));
    });
});

themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("ve-doc-theme", nextTheme);
});

function closeMenu() {
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    backdrop.hidden = true;
}

menuToggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    backdrop.hidden = !open;
});

backdrop.addEventListener("click", closeMenu);
navLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});

document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
        const code = button.nextElementSibling?.textContent ?? "";
        await navigator.clipboard.writeText(code);
        const previous = button.textContent;
        button.textContent = currentLanguage === "fr" ? "Copié !" : "Copied!";
        setTimeout(() => (button.textContent = previous), 1400);
    });
});

const fieldSearch = document.querySelector("#field-search");
const fieldCards = [...document.querySelectorAll(".field-card")];
const fieldEmpty = document.querySelector("#field-empty");

fieldSearch.addEventListener("input", () => {
    const query = fieldSearch.value.trim().toLocaleLowerCase(currentLanguage);
    let visibleCount = 0;

    fieldCards.forEach((card) => {
        const content =
            `${card.dataset.search} ${card.textContent}`.toLocaleLowerCase(
                currentLanguage,
            );
        const visible = content.includes(query);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
    });

    fieldEmpty.hidden = visibleCount !== 0;
});

const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

const observer = new IntersectionObserver(
    (entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        navLinks.forEach((link) => {
            const active =
                link.getAttribute("href") === `#${visible.target.id}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    },
    { rootMargin: "-20% 0px -65%", threshold: [0, 0.2, 0.6] },
);

observedSections.forEach((section) => observer.observe(section));
document.querySelector("#year").textContent = new Date().getFullYear();
