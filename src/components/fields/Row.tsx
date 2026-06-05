import { BlocValue, FieldDefinition, FieldsGroupComponent } from "../../types";
import { defineFieldsGroup } from "../../utils/utils";
import { FieldsRenderer } from "../sidebar/FieldsRenderer";

type FieldArgs = { fields: FieldDefinition<any, any>[]; columns?: string; name: string };
type RowComponentProps = {
    options: FieldArgs;
    value: BlocValue;
    onChange: (v: any) => void;
};
function RowComponent({ onChange, options }: RowComponentProps) {
    const onUpdate = (v: any, path: string) => {
        const data = {} as { [key: string]: any };
        const key = path.substring(1, path.length);

        data[key] = v;

        onChange(data);
    };

    const gridTemplate = Array.isArray(options)
        ? `repeat(${options.length}, 1fr)`
        : (options.columns ?? `repeat(${options.fields.length}, 1fr)`);
    const fields = Array.isArray(options) ? options : options.fields;

    return (
        <div style={{ gridTemplateColumns: `${gridTemplate}` }} className={`grid gap-2`}>
            {fields.map((f) => {
                return <FieldsRenderer key={f.name} fields={[f]} dataPath='' onUpdate={onUpdate} />;
            })}
        </div>
    );
}

const Component: FieldsGroupComponent<FieldArgs, BlocValue> = ({ onChange, options, value }) => {
    return <RowComponent options={options} value={value} onChange={onChange} />;
};

export const Row = defineFieldsGroup<FieldArgs, BlocValue>(Component);
