import { defineField } from "../../utils/utils";
import { FieldComponent } from "../../types";
import { Field } from "./Field";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import BoldIcon from "../../assets/imgs/bold.svg?react";

type FieldArgs = {
    label: string;
    description?: string;
    defaultValue?: string;
    placeholder?: string;
};

type ComponentProps = {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
};

const textFieldClasses =
    "border-1 border-dark/20 p-2 w-full focus:outline-none focus:border-primary/20 focus:outline-2! focus:outline-solid focus:outline-primary/20";
function HTMLTextComponent({ value, onChange, placeholder }: ComponentProps) {
    const editor = useEditor({
        extensions: [StarterKit, Placeholder.configure({ placeholder })],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const { isBold } = useEditorState({
        editor,
        selector: ({ editor }) => ({
            isBold: editor?.isActive("bold") ?? false,
        }),
    });

    if (!editor) return null;

    return (
        <div>
            <button
                type='button'
                className={`btn btn-outline-primary mb-2 py-1 px-0.5 text-5 ${isBold ? "bg-primary text-white" : ""}`}
                onClick={() => {
                    editor.chain().focus().toggleBold().run();
                }}>
                <BoldIcon />
            </button>
            <EditorContent editor={editor} className={`${textFieldClasses} min-h-[100px]`} />
        </div>
    );
}

const Component: FieldComponent<FieldArgs & typeof defaultOptions, string> = ({ value, onChange, options }) => {
    return (
        <Field label={options.label} description={options.description}>
            <HTMLTextComponent value={value} onChange={onChange} placeholder={options.placeholder} />
        </Field>
    );
};

const defaultOptions = {
    defaultValue: "",
    placeholder: "iii",
};

export const HTMLText = defineField<FieldArgs, string, typeof defaultOptions>({
    defaultOptions,
    render: Component,
});
