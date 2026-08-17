import {
    ComponentValue,
    FieldDefinition,
    FieldsGroupComponent,
} from "../../types";
import { defineFieldsGroup } from "../../utils/utils";
import { FieldsRenderer } from "../sidebar/FieldsRenderer";

type FieldArgs = {
    fields: FieldDefinition<any, any>[];
    columns?: string;
    collapsed?: boolean;
    label?: string;
};
type RowComponentProps = {
    options: FieldArgs;
    value: ComponentValue;
    onChange: (v: any) => void;
    label?: string;
};
function RowComponent({ onChange, options }: RowComponentProps) {
    const onUpdate = (v: any, path: string) => {
        const data = {} as { [key: string]: any };
        const key = path.substring(1, path.length);

        data[key] = v;

        onChange(data);
    };

    const fields = Array.isArray(options.fields) ? options.fields : [];
    const gridTemplate = options.columns ?? `repeat(${fields.length}, 1fr)`;

    return (
        <div className='flex flex-col gap-2'>
            {options.label && (
                <p className='font-500 text-ve-dark/60 text-4.2 mb-2'>
                    {options.label}
                </p>
            )}
            <div
                style={{ gridTemplateColumns: `${gridTemplate}` }}
                className={`grid w-full ${options.collapsed ? "gap-0" : "gap-2"}`}>
                {fields.map((f) => {
                    return (
                        <div className='w-full' key={f.name}>
                            <FieldsRenderer
                                key={f.name}
                                fields={[f]}
                                dataPath=''
                                onUpdate={onUpdate}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const Component: FieldsGroupComponent<FieldArgs, ComponentValue> = ({
    onChange,
    options,
    value,
}) => {
    return <RowComponent options={options} value={value} onChange={onChange} />;
};

export const Row = defineFieldsGroup<FieldArgs, ComponentValue>(Component);
