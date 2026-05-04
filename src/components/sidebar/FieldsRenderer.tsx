import { memo } from "react";
import { BlocDefinition, BlocValue } from "../../types";
import { FieldRenderer } from "./FieldRenderer";

export const FieldsRenderer = memo(function FieldsRenderer({
    data,
    fields,
    dataPath,
}: {
    data: BlocValue;
    fields: BlocDefinition["fields"];
    dataPath: string;
}) {
    return (
        <div className='flex flex-col gap-2'>
            {fields.map((field, i) => (
                <FieldRenderer dataPath={dataPath} data={data} key={i} field={field}></FieldRenderer>
            ))}
        </div>
    );
});
