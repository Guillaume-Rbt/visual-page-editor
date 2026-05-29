import { memo } from "react";
import { BlocDefinition } from "../../types";
import { FieldRenderer } from "./FieldRenderer";
import { useBlocData } from "../../Store";

export const FieldsRenderer = memo(function FieldsRenderer({
    fields,
    dataPath,
    id = null as unknown as string,
    onUpdate,
    data = null as unknown as Record<string, any>,
    isVisible = true,
}: {
    fields: BlocDefinition["fields"];
    dataPath: string;
    id?: string;
    isVisible?: Boolean;
    onUpdate: Function;
    data?: Record<string, any>;
}) {
    const isRepeaterFields = id === null;

    const blocData = data ?? useBlocData(id).data;

    return (
        <div className={`flex flex-col gap-2 ${!isVisible ? "hidden" : ""}`}>
            {fields.map((field) => (
                <FieldRenderer
                    onChange={onUpdate}
                    dataPath={isRepeaterFields ? `${dataPath}` : `${dataPath}.data`}
                    data={blocData}
                    key={`${id}-${field.name}`}
                    field={field}></FieldRenderer>
            ))}
        </div>
    );
});
