import { ComponentType, ReactNode, useRef } from "react";
import { Extension } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { BackgroundColor, TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { defineField, translation } from "../../utils/utils";
import { FieldComponent } from "../../types";
import { Field } from "./Field";
import { Select } from "../ui/Select";
import { Tooltip } from "../ui/Tooltip";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (fontSize: string) => ReturnType;
            unsetFontSize: () => ReturnType;
        };
        fontWeight: {
            setFontWeight: (fontWeight: string) => ReturnType;
            unsetFontWeight: () => ReturnType;
        };
    }
}

const FontSize = Extension.create({
    name: "fontSize",

    addOptions() {
        return {
            types: ["textStyle"],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
                        renderHTML: (attributes: { fontSize?: string | null }) => {
                            if (!attributes.fontSize) {
                                return {};
                            }

                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize:
                (fontSize: string) =>
                ({ chain }) =>
                    chain().setMark("textStyle", { fontSize }).run(),
            unsetFontSize:
                () =>
                ({ chain }) =>
                    chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
        };
    },
});

const FontWeight = Extension.create({
    name: "fontWeight",

    addOptions() {
        return {
            types: ["textStyle"],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontWeight: {
                        default: null,
                        parseHTML: (element: HTMLElement) => element.style.fontWeight || null,
                        renderHTML: (attributes: { fontWeight?: string | null }) => {
                            if (!attributes.fontWeight) {
                                return {};
                            }

                            return {
                                style: `font-weight: ${attributes.fontWeight}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontWeight:
                (fontWeight: string) =>
                ({ chain }) =>
                    chain().setMark("textStyle", { fontWeight }).run(),
            unsetFontWeight:
                () =>
                ({ chain }) =>
                    chain().setMark("textStyle", { fontWeight: null }).removeEmptyTextStyle().run(),
        };
    },
});

type TextStyleControl = "bold" | "italic";
type TextDecorationControl = "underline" | "strike";
type TextAlignControl = "left" | "center" | "right" | "justify";
type ListControl = "bulletList" | "orderedList";
type AtomicButton = TextStyleControl | TextDecorationControl | TextAlignControl | ListControl;
type ColorOptionInput = string | { value: string; label: string };
type ColorOption = { value: string; label: string };

type HTMLTextListButton =
    | { headings: Array<number | `${number}`> }
    | { colors: ColorOptionInput[] }
    | { backgroundColors: ColorOptionInput[] }
    | { fontFamily: string[] }
    | { fontFamilies: string[] }
    | { textStyle: TextStyleControl[] }
    | { textDecoration: TextDecorationControl[] }
    | { lists: ListControl[] }
    | { fontWeights: Array<number | `${number}`> }
    | { fontSizes: string[] }
    | { textAlign: TextAlignControl[] };

type ToolbarShortcut =
    | "headings"
    | "textStyle"
    | "textDecoration"
    | "lists"
    | "textAlign"
    | "fontFamily"
    | "fontWeight"
    | "fontSize";

type HTMLTextButton = AtomicButton | ToolbarShortcut | HTMLTextListButton;

type NormalizedToolbar = {
    headings?: number[];
    colors?: ColorOption[];
    backgroundColors?: ColorOption[];
    fontFamilies?: string[];
    fontWeights?: string[];
    fontSizes?: string[];
    textStyle: { mode: "buttons" | "select"; items: TextStyleControl[] };
    textDecoration: { mode: "buttons" | "select"; items: TextDecorationControl[] };
    lists: { mode: "buttons" | "select"; items: ListControl[] };
    textAlign: { mode: "buttons" | "select"; items: TextAlignControl[] };
};

type FieldArgs = {
    label: string;
    description?: string;
    defaultValue?: string;
    placeholder?: string;
    buttons: HTMLTextButton[];
};

type ComponentProps = {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    buttons: HTMLTextButton[];
};

type ToolbarButtonProps = {
    active: boolean;
    label: ReactNode;
    title: string;
    onClick: () => void;
};

const DEFAULT_HEADINGS = [1, 2, 3, 4, 5, 6];
const DEFAULT_TEXT_STYLES: TextStyleControl[] = ["bold", "italic"];
const DEFAULT_TEXT_DECORATIONS: TextDecorationControl[] = ["underline", "strike"];
const DEFAULT_LISTS: ListControl[] = ["bulletList", "orderedList"];
const DEFAULT_TEXT_ALIGN: TextAlignControl[] = ["left", "center", "right", "justify"];
const DEFAULT_FONT_FAMILIES = ["Arial", "Georgia", "Tahoma", "Times New Roman", "Verdana"];
const DEFAULT_FONT_WEIGHTS = ["300", "400", "500", "600", "700"];
const DEFAULT_FONT_SIZES = ["12px", "14px", "16px", "20px", "24px", "32px"];

const textStyleOrder: TextStyleControl[] = ["bold", "italic"];
const textDecorationOrder: TextDecorationControl[] = ["underline", "strike"];
const listOrder: ListControl[] = ["bulletList", "orderedList"];
const textAlignOrder: TextAlignControl[] = ["left", "center", "right", "justify"];

const controlLabelKeys: Record<AtomicButton, string> = {
    bold: "richTextBoldShort",
    italic: "richTextItalicShort",
    underline: "richTextUnderlineShort",
    strike: "richTextStrikeShort",
    bulletList: "richTextBulletListShort",
    orderedList: "richTextOrderedListShort",
    left: "richTextAlignLeftShort",
    center: "richTextAlignCenterShort",
    right: "richTextAlignRightShort",
    justify: "richTextAlignJustifyShort",
};

const controlTitleKeys: Record<AtomicButton, string> = {
    bold: "richTextBold",
    italic: "richTextItalic",
    underline: "richTextUnderline",
    strike: "richTextStrike",
    bulletList: "richTextBulletList",
    orderedList: "richTextOrderedList",
    left: "richTextAlignLeft",
    center: "richTextAlignCenter",
    right: "richTextAlignRight",
    justify: "richTextAlignJustify",
};

type IconComponent = ComponentType<{ className?: string }>;

const toolbarIconModules = import.meta.glob("../../assets/imgs/*.svg", {
    eager: true,
    import: "default",
    query: "?react",
}) as Record<string, IconComponent>;

const toolbarIcons = Object.entries(toolbarIconModules).reduce<Record<string, IconComponent>>((icons, [path, icon]) => {
    const fileName = path.split("/").pop() ?? "";
    const baseName = fileName.replace(".svg", "");

    if (baseName) {
        icons[baseName] = icon;
    }

    return icons;
}, {});

function toKebabCase(value: string) {
    return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

function getToolbarIcon(name: string) {
    return toolbarIcons[name] ?? toolbarIcons[toKebabCase(name)];
}

function uniquePush<T>(items: T[], value: T) {
    if (!items.includes(value)) {
        items.push(value);
    }
}

function sortByOrder<T extends string>(items: T[], order: readonly T[]) {
    return [...items].sort((left, right) => order.indexOf(left) - order.indexOf(right));
}

function normalizeHeadings(levels: Array<number | `${number}`>) {
    return [...new Set(levels.map((level) => Number(level)).filter((level) => level >= 1 && level <= 6))].sort(
        (left, right) => left - right,
    );
}

function normalizeColorOptions(colors: ColorOptionInput[]): ColorOption[] {
    const uniqueColors = new Map<string, ColorOption>();

    for (const color of colors) {
        if (typeof color === "string") {
            if (!uniqueColors.has(color)) {
                uniqueColors.set(color, { value: color, label: color });
            }

            continue;
        }

        if (!uniqueColors.has(color.value)) {
            uniqueColors.set(color.value, color);
        }
    }

    return [...uniqueColors.values()];
}

function normalizeToolbar(buttons: HTMLTextButton[]): NormalizedToolbar {
    const toolbar: NormalizedToolbar = {
        textStyle: { mode: "buttons", items: [] },
        textDecoration: { mode: "buttons", items: [] },
        lists: { mode: "buttons", items: [] },
        textAlign: { mode: "buttons", items: [] },
    };

    for (const button of buttons) {
        if (typeof button === "string") {
            switch (button) {
                case "bold":
                case "italic":
                    uniquePush(toolbar.textStyle.items, button);
                    break;
                case "underline":
                case "strike":
                    uniquePush(toolbar.textDecoration.items, button);
                    break;
                case "bulletList":
                case "orderedList":
                    uniquePush(toolbar.lists.items, button);
                    break;
                case "left":
                case "center":
                case "right":
                case "justify":
                    uniquePush(toolbar.textAlign.items, button);
                    break;
                case "headings":
                    toolbar.headings = DEFAULT_HEADINGS;
                    break;
                case "textStyle":
                    toolbar.textStyle.mode = "select";
                    for (const item of DEFAULT_TEXT_STYLES) {
                        uniquePush(toolbar.textStyle.items, item);
                    }
                    break;
                case "textDecoration":
                    toolbar.textDecoration.mode = "select";
                    for (const item of DEFAULT_TEXT_DECORATIONS) {
                        uniquePush(toolbar.textDecoration.items, item);
                    }
                    break;
                case "lists":
                    toolbar.lists.mode = "select";
                    for (const item of DEFAULT_LISTS) {
                        uniquePush(toolbar.lists.items, item);
                    }
                    break;
                case "textAlign":
                    toolbar.textAlign.mode = "select";
                    for (const item of DEFAULT_TEXT_ALIGN) {
                        uniquePush(toolbar.textAlign.items, item);
                    }
                    break;
                case "fontFamily":
                    toolbar.fontFamilies = DEFAULT_FONT_FAMILIES;
                    break;
                case "fontWeight":
                    toolbar.fontWeights = DEFAULT_FONT_WEIGHTS;
                    break;
                case "fontSize":
                    toolbar.fontSizes = DEFAULT_FONT_SIZES;
                    break;
            }

            continue;
        }

        if ("headings" in button) {
            toolbar.headings = normalizeHeadings(button.headings);
        }

        if ("colors" in button) {
            toolbar.colors = normalizeColorOptions(button.colors);
        }

        if ("backgroundColors" in button) {
            toolbar.backgroundColors = normalizeColorOptions(button.backgroundColors);
        }

        if ("fontFamily" in button) {
            toolbar.fontFamilies = [...new Set(button.fontFamily)];
        }

        if ("fontFamilies" in button) {
            toolbar.fontFamilies = [...new Set(button.fontFamilies)];
        }

        if ("textStyle" in button) {
            toolbar.textStyle.mode = "select";
            for (const item of button.textStyle.filter((value): value is TextStyleControl =>
                textStyleOrder.includes(value),
            )) {
                uniquePush(toolbar.textStyle.items, item);
            }
        }

        if ("textDecoration" in button) {
            toolbar.textDecoration.mode = "select";
            for (const item of button.textDecoration.filter((value): value is TextDecorationControl =>
                textDecorationOrder.includes(value),
            )) {
                uniquePush(toolbar.textDecoration.items, item);
            }
        }

        if ("lists" in button) {
            toolbar.lists.mode = "select";
            for (const item of button.lists.filter((value): value is ListControl => listOrder.includes(value))) {
                uniquePush(toolbar.lists.items, item);
            }
        }

        if ("fontWeights" in button) {
            toolbar.fontWeights = [...new Set(button.fontWeights.map((value) => `${value}`))];
        }

        if ("fontSizes" in button) {
            toolbar.fontSizes = [...new Set(button.fontSizes)];
        }

        if ("textAlign" in button) {
            toolbar.textAlign.mode = "select";
            for (const item of button.textAlign.filter((value): value is TextAlignControl =>
                textAlignOrder.includes(value),
            )) {
                uniquePush(toolbar.textAlign.items, item);
            }
        }
    }

    toolbar.textStyle.items = sortByOrder(toolbar.textStyle.items, textStyleOrder);
    toolbar.textDecoration.items = sortByOrder(toolbar.textDecoration.items, textDecorationOrder);
    toolbar.lists.items = sortByOrder(toolbar.lists.items, listOrder);
    toolbar.textAlign.items = sortByOrder(toolbar.textAlign.items, textAlignOrder);

    return toolbar;
}

function ToolbarButton({ active, label, title, onClick }: ToolbarButtonProps) {
    return (
        <button
            type='button'
            title={title}
            className={`btn btn-outline-primary h-8 w-8 flex items-center justify-center py-1 px-1 text-4 ${active ? "bg-primary text-white" : ""}`}
            onClick={onClick}>
            {label}
        </button>
    );
}

const textFieldClasses =
    "border-1 border-dark/20 p-2 w-full focus:outline-none focus:border-primary/20 focus:outline-2! focus:outline-solid focus:outline-primary/20";
const richTextContentClasses =
    "[&_em]:italic [&_i]:italic [&_strong]:font-bold [&_b]:font-bold [&_h1]:text-8 [&_h1]:font-700 [&_h2]:text-7 [&_h2]:font-700 [&_h3]:text-6 [&_h3]:font-700 [&_h4]:text-5 [&_h4]:font-700 [&_h5]:text-4 [&_h5]:font-700 [&_h6]:text-4 [&_h6]:font-600";
function HTMLTextComponent({ value, onChange, placeholder, buttons }: ComponentProps) {
    const toolbar = normalizeToolbar(buttons);
    const controlLabels: Record<AtomicButton, ReactNode> = {
        bold: translation(controlLabelKeys.bold),
        italic: translation(controlLabelKeys.italic),
        underline: translation(controlLabelKeys.underline),
        strike: translation(controlLabelKeys.strike),
        bulletList: translation(controlLabelKeys.bulletList),
        orderedList: translation(controlLabelKeys.orderedList),
        left: translation(controlLabelKeys.left),
        center: translation(controlLabelKeys.center),
        right: translation(controlLabelKeys.right),
        justify: translation(controlLabelKeys.justify),
    };
    const controlTitles: Record<AtomicButton, string> = {
        bold: translation(controlTitleKeys.bold),
        italic: translation(controlTitleKeys.italic),
        underline: translation(controlTitleKeys.underline),
        strike: translation(controlTitleKeys.strike),
        bulletList: translation(controlTitleKeys.bulletList),
        orderedList: translation(controlTitleKeys.orderedList),
        left: translation(controlTitleKeys.left),
        center: translation(controlTitleKeys.center),
        right: translation(controlTitleKeys.right),
        justify: translation(controlTitleKeys.justify),
    };
    const getControlLabel = (name: AtomicButton) => {
        const Icon = getToolbarIcon(name);

        if (Icon) {
            return <Icon className='w-4 h-4' />;
        }

        return controlLabels[name];
    };
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Placeholder.configure({ placeholder }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            FontFamily,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            FontSize,
            FontWeight,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            isBold: editor?.isActive("bold") ?? false,
            isItalic: editor?.isActive("italic") ?? false,
            isUnderline: editor?.isActive("underline") ?? false,
            isStrike: editor?.isActive("strike") ?? false,
            isBulletList: editor?.isActive("bulletList") ?? false,
            isOrderedList: editor?.isActive("orderedList") ?? false,
            currentHeading: DEFAULT_HEADINGS.find((level) => editor?.isActive("heading", { level })) ?? 0,
            currentTextAlign:
                editor?.getAttributes("heading").textAlign ?? editor?.getAttributes("paragraph").textAlign ?? "left",
            currentTextColor: editor?.getAttributes("textStyle").color ?? "",
            currentFontFamily: editor?.getAttributes("textStyle").fontFamily ?? "",
            currentFontSize: editor?.getAttributes("textStyle").fontSize ?? "",
            currentFontWeight: editor?.getAttributes("textStyle").fontWeight ?? "",
            currentBackgroundColor: editor?.getAttributes("highlight").color ?? "",
        }),
    });

    if (!editor) return null;

    const currentTextStyleValue =
        toolbar.textStyle.items.find((item) => {
            return item === "bold" ? editorState.isBold : editorState.isItalic;
        }) ?? "";

    const currentTextDecorationValue =
        toolbar.textDecoration.items.find((item) => {
            return item === "underline" ? editorState.isUnderline : editorState.isStrike;
        }) ?? "";

    const currentListValue =
        toolbar.lists.items.find((item) => {
            return item === "bulletList" ? editorState.isBulletList : editorState.isOrderedList;
        }) ?? "";

    return (
        <div>
            <div className='mb-2 flex flex-wrap items-center gap-2'>
                {toolbar.headings && toolbar.headings.length > 0 && (
                    <Select
                        placeholder='Niveau'
                        value={editorState.currentHeading ? `${editorState.currentHeading}` : "no-heading"}
                        options={[
                            { value: "no-heading", render: () => translation("richTextHeading") },
                            ...toolbar.headings.map((level) => ({ value: level, render: () => `H${level}` })),
                        ]}
                        onChange={(nextValue) => {
                            if (nextValue === "no-heading") {
                                editor.chain().focus().setParagraph().run();
                                return;
                            }

                            editor
                                .chain()
                                .focus()
                                .setHeading({ level: Number(nextValue) as 1 | 2 | 3 | 4 | 5 | 6 })
                                .run();
                        }}
                    />
                )}

                {toolbar.fontFamilies && toolbar.fontFamilies.length > 0 && (
                    <Select
                        value={toolbar.fontFamilies.find((font) => font === editorState.currentFontFamily) ?? ""}
                        placeholder={translation("richTextFontFamily")}
                        onChange={(nextValue) => {
                            const chain = editor.chain().focus();

                            if (nextValue === "") {
                                chain.unsetFontFamily().run();
                                return;
                            }

                            chain.setFontFamily(nextValue).run();
                        }}
                        options={[
                            { value: "", render: () => "Par defaut" },
                            ...toolbar.fontFamilies.map((font) => ({ value: font, render: () => font })),
                        ]}
                    />
                )}

                {toolbar.fontSizes && toolbar.fontSizes.length > 0 && (
                    <Select
                        options={[
                            { value: "", render: () => translation("defaultFontSize") },
                            ...toolbar.fontSizes.map((s) => ({ value: s, render: () => s })),
                        ]}
                        value={toolbar.fontSizes.find((s) => s === editorState.currentFontSize) ?? ""}
                        placeholder={translation("richTextFontSize")}
                        onChange={(s) => {
                            const chain = editor.chain().focus();

                            if (s === "") {
                                chain.unsetFontSize().run();
                                return;
                            }

                            chain.setFontSize(s).run();
                        }}></Select>
                )}

                {toolbar.fontWeights && toolbar.fontWeights.length > 0 && (
                    <Select
                        value={toolbar.fontWeights.find((weight) => weight === editorState.currentFontWeight) ?? ""}
                        placeholder={translation("richTextFontWeight")}
                        onChange={(nextValue) => {
                            const chain = editor.chain().focus();

                            if (nextValue === "") {
                                chain.unsetFontWeight().run();
                                return;
                            }

                            chain.setFontWeight(nextValue).run();
                        }}
                        options={[
                            { value: "", render: () => translation("defaultFontWeight") },
                            ...toolbar.fontWeights.map((fontWeight) => ({
                                value: fontWeight,
                                render: () => fontWeight,
                            })),
                        ]}
                    />
                )}

                {toolbar.textStyle.items.length > 0 && toolbar.textStyle.mode === "buttons" && (
                    <div className='flex items-center gap-1'>
                        {toolbar.textStyle.items.map((item) => {
                            const active = item === "bold" ? editorState.isBold : editorState.isItalic;

                            return (
                                <ToolbarButton
                                    key={item}
                                    active={active}
                                    label={getControlLabel(item)}
                                    title={controlTitles[item]}
                                    onClick={() => {
                                        const chain = editor.chain().focus();

                                        if (item === "bold") {
                                            chain.toggleBold().run();
                                            return;
                                        }

                                        chain.toggleItalic().run();
                                    }}
                                />
                            );
                        })}
                    </div>
                )}

                {toolbar.textStyle.items.length > 0 && toolbar.textStyle.mode === "select" && (
                    <Select
                        value={currentTextStyleValue}
                        onChange={(nextValue) => {
                            const chain = editor.chain().focus();

                            if (nextValue === "bold") {
                                chain.toggleBold().run();
                                return;
                            }

                            if (nextValue === "italic") {
                                chain.toggleItalic().run();
                            }
                        }}
                        options={toolbar.textStyle.items.map((item) => ({
                            value: item,
                            render: () => controlTitles[item],
                        }))}
                    />
                )}

                {toolbar.textDecoration.items.length > 0 && toolbar.textDecoration.mode === "buttons" && (
                    <div className='flex items-center gap-1'>
                        {toolbar.textDecoration.items.map((item) => {
                            const active = item === "underline" ? editorState.isUnderline : editorState.isStrike;

                            return (
                                <ToolbarButton
                                    key={item}
                                    active={active}
                                    label={getControlLabel(item)}
                                    title={controlTitles[item]}
                                    onClick={() => {
                                        const chain = editor.chain().focus();

                                        if (item === "underline") {
                                            chain.toggleUnderline().run();
                                            return;
                                        }

                                        chain.toggleStrike().run();
                                    }}
                                />
                            );
                        })}
                    </div>
                )}

                {toolbar.textDecoration.items.length > 0 && toolbar.textDecoration.mode === "select" && (
                    <Select
                        value={currentTextDecorationValue}
                        placeholder={translation("richTextDecoration")}
                        onChange={(nextValue) => {
                            const chain = editor.chain().focus();

                            if (nextValue === "underline") {
                                chain.toggleUnderline().run();
                                return;
                            }

                            if (nextValue === "strike") {
                                chain.toggleStrike().run();
                            }
                        }}
                        options={toolbar.textDecoration.items.map((item) => ({
                            value: item,
                            render: () => controlTitles[item],
                        }))}
                    />
                )}

                {toolbar.lists.items.length > 0 && toolbar.lists.mode === "buttons" && (
                    <div className='flex items-center gap-1'>
                        {toolbar.lists.items.map((item) => {
                            const active = item === "bulletList" ? editorState.isBulletList : editorState.isOrderedList;

                            return (
                                <ToolbarButton
                                    key={item}
                                    active={active}
                                    label={getControlLabel(item)}
                                    title={controlTitles[item]}
                                    onClick={() => {
                                        const chain = editor.chain().focus();

                                        if (item === "bulletList") {
                                            chain.toggleBulletList().run();
                                            return;
                                        }

                                        chain.toggleOrderedList().run();
                                    }}
                                />
                            );
                        })}
                    </div>
                )}

                {toolbar.lists.items.length > 0 && toolbar.lists.mode === "select" && (
                    <Select
                        value={currentListValue}
                        placeholder={translation("richTextLists")}
                        onChange={(nextValue) => {
                            const chain = editor.chain().focus();

                            if (nextValue === "bulletList") {
                                chain.toggleBulletList().run();
                                return;
                            }

                            if (nextValue === "orderedList") {
                                chain.toggleOrderedList().run();
                            }
                        }}
                        options={toolbar.lists.items.map((item) => ({
                            value: item,
                            render: () => controlTitles[item],
                        }))}
                    />
                )}

                {toolbar.colors && toolbar.colors.length > 0 && (
                    <Tooltip text={translation("richTextColor")}>
                        <Select
                            layout={{ cols: 3, width: "1em" }}
                            mode='menu'
                            options={[
                                {
                                    value: "auto",
                                    render: () => {
                                        const selected =
                                            (toolbar.colors?.find(
                                                (color) => color.value === editorState.currentTextColor,
                                            )?.value ?? "auto") == "auto";

                                        return (
                                            <div className='flex items-center w-full gap-2'>
                                                <span
                                                    style={{ backgroundColor: "transparent" }}
                                                    className={`w-4 h-4 rounded-full ml-auto border-1 border-dark/10 ${selected ? "outline-2 outline-primary" : "hover:outline-2 hover:outline-primary"}`}></span>
                                            </div>
                                        );
                                    },
                                },
                                ...toolbar.colors.map((color) => ({
                                    value: color.value,
                                    render: () => {
                                        const selected = color.value === editorState.currentTextColor;

                                        return (
                                            <Tooltip positionAnchor='pointer' text={color.label}>
                                                <div className='flex items-center w-full'>
                                                    <span
                                                        style={{ backgroundColor: color.value }}
                                                        className={`block w-4 h-4 rounded-full  border-1 border-dark/10 ${selected ? "outline-2 outline-primary" : "hover:outline-2 hover:outline-primary"}`}></span>
                                                </div>
                                            </Tooltip>
                                        );
                                    },
                                })),
                            ]}
                            selectedRenderer={(options) => {
                                const isDefaultColor = options.value === "auto";

                                return (
                                    <div className='flex flex-grow items-center gap-2'>
                                        <p
                                            style={{ color: isDefaultColor ? "#000" : (options.value as string) }}
                                            className='w-max flex-grow font-700'>
                                            Aa
                                        </p>
                                    </div>
                                );
                            }}
                            value={
                                toolbar.colors.find((color) => color.value === editorState.currentTextColor)?.value ??
                                "auto"
                            }
                            placeholder={translation("richTextTextColor")}
                            onChange={(nextValue) => {
                                const chain = editor.chain().focus();

                                if (nextValue === "auto") {
                                    chain.unsetColor().run();
                                    return;
                                }

                                chain.setColor(nextValue).run();
                            }}
                        />
                    </Tooltip>
                )}

                {toolbar.backgroundColors && toolbar.backgroundColors.length > 0 && (
                    <Tooltip text={translation("richTextBackgroundColor")}>
                        <Select
                            layout={{ cols: 3, width: "1em" }}
                            mode='menu'
                            options={[
                                {
                                    value: "auto",
                                    render: () => {
                                        const selected =
                                            (toolbar.backgroundColors?.find(
                                                (color) => color.value === editorState.currentBackgroundColor,
                                            )?.value ?? "auto") == "auto";
                                        return (
                                            <div className='flex items-center w-full gap-2'>
                                                <span
                                                    style={{ backgroundColor: "transparent" }}
                                                    className={`w-4 h-4 rounded-full ml-auto border-1 border-dark/10 ${selected ? "outline-2 outline-primary" : ""}`}></span>
                                            </div>
                                        );
                                    },
                                },
                                ...toolbar.backgroundColors.map((color) => ({
                                    value: color.value,
                                    render: () => {
                                        const selected = color.value === editorState.currentBackgroundColor;
                                        return (
                                            <Tooltip positionAnchor='pointer' text={color.label}>
                                                <div className='flex items-center w-full'>
                                                    <span
                                                        style={{ backgroundColor: color.value }}
                                                        className={`block w-4 h-4 rounded-full  border-1 border-dark/10 ${selected ? "outline-2 outline-primary" : "hover:outline-2 hover:outline-primary"}`}></span>
                                                </div>
                                            </Tooltip>
                                        );
                                    },
                                })),
                            ]}
                            selectedRenderer={(options) => {
                                const isDefaultColor = options.value === "auto";

                                return (
                                    <div className='flex items-center w-full'>
                                        <p
                                            style={{
                                                backgroundColor: isDefaultColor
                                                    ? "transparent"
                                                    : (options.value as string),
                                            }}
                                            className='w-max font-700'>
                                            Aa
                                        </p>
                                    </div>
                                );
                            }}
                            value={
                                toolbar.backgroundColors.find(
                                    (color) => color.value === editorState.currentBackgroundColor,
                                )?.value ?? "auto"
                            }
                            placeholder={translation("richTextBackgroundColor")}
                            onChange={(nextValue) => {
                                const chain = editor.chain().focus();

                                if (nextValue === "auto") {
                                    chain.unsetHighlight().run();
                                    return;
                                }

                                chain.setHighlight({ color: nextValue }).run();
                            }}
                        />
                    </Tooltip>
                )}

                {toolbar.textAlign.items.length > 0 && toolbar.textAlign.mode === "buttons" && (
                    <div className='flex items-center gap-1'>
                        {toolbar.textAlign.items.map((item) => {
                            return (
                                <ToolbarButton
                                    key={item}
                                    active={editorState.currentTextAlign === item}
                                    label={getControlLabel(item)}
                                    title={controlTitles[item]}
                                    onClick={() => {
                                        editor.chain().focus().setTextAlign(item).run();
                                    }}
                                />
                            );
                        })}
                    </div>
                )}

                {toolbar.textAlign.items.length > 0 && toolbar.textAlign.mode === "select" && (
                    <Select
                        value={
                            toolbar.textAlign.items.find((item) => item === editorState.currentTextAlign) ??
                            toolbar.textAlign.items[0]
                        }
                        placeholder={translation("richTextAlignment")}
                        onChange={(nextValue) => {
                            if (nextValue === "") {
                                editor.chain().focus().unsetTextAlign().run();
                                return;
                            }

                            editor
                                .chain()
                                .focus()
                                .setTextAlign(nextValue as TextAlignControl)
                                .run();
                        }}
                        options={toolbar.textAlign.items.map((item) => ({
                            value: item,
                            render: () => controlTitles[item],
                        }))}
                    />
                )}
            </div>
            <EditorContent editor={editor} className={`${textFieldClasses} ${richTextContentClasses} min-h-[100px]`} />
        </div>
    );
}

const Component: FieldComponent<FieldArgs & typeof defaultOptions, string> = ({ value, onChange, options }) => {
    return (
        <Field label={options.label} description={options.description}>
            <HTMLTextComponent
                value={value}
                onChange={onChange}
                placeholder={options.placeholder}
                buttons={options.buttons}
            />
        </Field>
    );
};

const defaultOptions = {
    defaultValue: "",
    placeholder: "Votre texte ici...",
    buttons: [
        "bold",
        "italic",
        "underline",
        "strike",
        { headings: [1, 2, 3] },
        { colors: ["red", "green", "blue"] },
        { backgroundColors: ["#ff0000", "lightgray"] },
        { fontSizes: ["12px", "14px", "16px", "20px", "24px", "32px"] },
        "bulletList",
        "left",
        "center",
        "right",
        "justify",
    ] as HTMLTextButton[],
};

export const HTMLText = defineField<FieldArgs, string, typeof defaultOptions>({
    defaultOptions,
    render: Component,
});
