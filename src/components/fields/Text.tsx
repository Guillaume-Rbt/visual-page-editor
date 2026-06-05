import { defineField } from "../../utils/utils";
import { FieldComponent } from "../../types";
import { Field } from "./Field";

type FieldArgs = {
    label: string;
    description?: string;
    multiline: boolean;
    defaultValue?: string;
    placeholder?: string;
};

type ComponentProps = {
    value: string;
    onChange: (v: string) => void;
    multiline: boolean;
    placeholder: string;
};
const textFieldClasses = "border-1 border-dark/20 p-2 focus:outline-none";
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

const Component: FieldComponent<FieldArgs, string> = ({ value, onChange, options }) => {
    return (
        <Field label={options.label} description={options.description}>
            <TextComponent
                multiline={options.multiline}
                value={value}
                onChange={onChange}
                placeholder={options.placeholder!}
            />
        </Field>
    );
};

export const Text = defineField<FieldArgs, string>({
    defaultOptions: {
        multiline: false,
        defaultValue: "",
        placeholder: "",
    },
    render: Component,
});
