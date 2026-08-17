import { FieldComponent, ValueFieldOptions } from "../../types";
import { Select as SelectRenderer } from "../ui/Select";
import { Field } from "./Field";
import { defineField } from "../../visual-editor";

type FieldArgs = ValueFieldOptions<string> & {
    options: { value: any; render: () => React.ReactNode | HTMLElement }[];
    placeholder?: string;
};

function SelectComponent({
    value,
    onChange,
    options,
}: {
    value: any;
    onChange: (value: any) => void;
    options: { value: any; render: () => React.ReactNode | HTMLElement }[];
}) {
    return (
        <SelectRenderer
            value={value}
            onChange={onChange}
            options={options}></SelectRenderer>
    );
}

const Component: FieldComponent<FieldArgs, any> = ({
    value,
    onChange,
    options,
}) => {
    return (
        <Field label={options.label} description={options.description}>
            <SelectComponent
                value={value}
                onChange={onChange}
                options={options.options}></SelectComponent>
        </Field>
    );
};

export const Select = defineField<FieldArgs, any>({
    defaultOptions: {
        defaultValue: "",
        placeholder: "",
    },
    render: Component,
});
