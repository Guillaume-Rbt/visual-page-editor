import {
    ComponentValue,
    FieldDefinition,
    FieldsGroupComponent,
    ValueFieldOptions,
} from "../../types";
import { defineField, FieldsRenderer } from "../../visual-editor";

type FieldArgs = ValueFieldOptions<Record<string, any>> & {
    name: string;
    label: string;
    fields: FieldDefinition<any, any>[];
};

type ComponentProps = {
    label: string;
    value: Record<string, any>;
    onChange: (v: Record<string, any>) => void;
    fields: FieldDefinition<any, any>[];
};

function GroupComponent({ fields, value, onChange, label }: ComponentProps) {
    const onUpdate = (v: any, path: string) => {
        console.log("GroupComponent onUpdate", v, path);

        const key = path.substring(1, path.length);

        onChange({ ...value, [key]: v });
    };

    return (
        <div className='flex flex-col gap-2 small-labels'>
            <p className='font-500 text-ve-dark/60 text-4.2 mb-2'>{label}</p>
            <div className='border-l-[2px] border-ve-dark/20 pl-4'>
                {" "}
                <FieldsRenderer
                    fields={fields}
                    dataPath=''
                    data={value}
                    onUpdate={onUpdate}
                />
            </div>
        </div>
    );
}

const Component: FieldsGroupComponent<FieldArgs, Record<string, unknown>> = ({
    onChange,
    options,
    value,
}) => {
    return (
        <GroupComponent
            label={options.label}
            fields={options.fields}
            value={value}
            onChange={onChange}
        />
    );
};

export const Group = defineField<FieldArgs, Record<string, unknown>>({
    defaultOptions: {
        name: "",
        label: "",
        fields: [],
    },
    render: Component,
});
