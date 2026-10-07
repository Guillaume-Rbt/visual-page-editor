import { type FieldComponent, ValueFieldOptions } from "../../types";
import { Field } from "./Field";
import { defineField } from "../../utils/utils";
import BrowseIcon from "../../assets/imgs/browse.svg?react";

type FieldArgs = ValueFieldOptions<string> & {
    defaultValue?: string;
    onBrowse: () => Promise<string | null>;
    placeholder?: string;
};

type ComponentProps = {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    onBrowse: () => Promise<string | null>;
};

const defaultOptions = {
    defaultValue: "",
    placeholder: "",
};

function FileComponent({
    value,
    placeholder,
    onChange,
    onBrowse,
}: ComponentProps) {
    return (
        <div className='grid grid-cols-[1fr_auto]'>
            <input
                type='text'
                className='bordered-input p-2 focus:border-ve-primary/20 focus:outline-2 focus:outline-solid focus:outline-ve-primary/20'
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                type='button'
                className='p-2 h-full  cursor-pointer border-[1px] border-[color-mix(in_srgb,var(--colors-ve-dark)_20%,transparent)] border-l-0 hover:bg-ve-dark/5'
                onClick={async () => {
                    const result = await onBrowse();
                    if (result !== null) {
                        onChange(result);
                    }
                }}>
                <BrowseIcon className={"text-4"} />
            </button>
        </div>
    );
}

const Component: FieldComponent<FieldArgs & typeof defaultOptions, string> = ({
    value,
    onChange,
    options,
}) => {
    return (
        <Field label={options.label} description={options.description}>
            <FileComponent
                value={value}
                onChange={onChange}
                placeholder={options.placeholder}
                onBrowse={options.onBrowse}
            />
        </Field>
    );
};

export const File = defineField<FieldArgs, string, typeof defaultOptions>({
    defaultOptions,
    render: Component,
});
