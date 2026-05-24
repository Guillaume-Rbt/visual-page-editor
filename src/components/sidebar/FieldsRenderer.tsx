import { memo } from "react";
import { BlocDefinition } from "../../types";
import { FieldRenderer } from "./FieldRenderer";
import { useBlocData } from "../../Store";

export const FieldsRenderer = memo(function FieldsRenderer({
    fields,
    dataPath,
    id
}: {
    fields: BlocDefinition["fields"];
    dataPath: string;
    id: string
}) {
   console.log("render fields of", id)
    const data = useBlocData(id)

    return (
        <div className='flex flex-col gap-2'>
            {fields.map((field) => (
                <FieldRenderer dataPath={dataPath} data={data} key={`${id}-${field.name}`} field={field}></FieldRenderer>
            ))}
        </div>
    );
});
