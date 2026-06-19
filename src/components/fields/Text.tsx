import { defineField } from "../../utils/utils";
import { FieldComponent } from "../../types";
import { Field } from "./Field";

type FieldArgs = {
    label: string;
    description?: string;
    multiline?: boolean;
    defaultValue?: string;
    placeholder?: string;
};

type ComponentProps = {
    value: string;
    onChange: (v: string) => void;
    multiline: boolean;
    placeholder: string;
};

const defaultOptions = {
    multiline: false,
    defaultValue: "",
    placeholder: "",
};

const textFieldClasses =
    "bordered-input p-2 w-full  focus:border-primary/20 focus:outline-2 focus:outline-solid focus:outline-primary/20";
function TextComponent({ value, onChange, multiline, placeholder }: ComponentProps) {
    const Field = multiline ? (
        <textarea
            className={`${textFieldClasses}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    ) : (
        <input
            className={`${textFieldClasses}`}
            placeholder={placeholder}
            type='text'
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );

    return <>{Field}</>;
}

const Component: FieldComponent<FieldArgs & typeof defaultOptions, string> = ({ value, onChange, options }) => {
    return (
        <Field label={options.label} description={options.description}>
            <TextComponent
                multiline={options.multiline}
                value={value}
                onChange={onChange}
                placeholder={options.placeholder}
            />
        </Field>
    );
};

export const Text = defineField<FieldArgs, string, typeof defaultOptions>({
    defaultOptions,
    render: Component,
});
