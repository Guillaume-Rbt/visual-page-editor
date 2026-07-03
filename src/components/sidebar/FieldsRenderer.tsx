import { memo } from "react";
import { ComponentDefinition } from "../../types";
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
    fields: ComponentDefinition["fields"];
    dataPath: string;
    id?: string;
    isVisible?: Boolean;
    onUpdate: (v: any, path: string) => void;
    data?: Record<string, any>;
}) {
    const isGroup = id === null;

    const blocData = data ?? useBlocData(id).data;

    return (
        <div className={`flex flex-col gap-3 ${!isVisible ? "hidden" : ""}`}>
            {fields.map((field) => (
                <FieldRenderer
                    onChange={onUpdate}
                    dataPath={isGroup ? `${dataPath}` : `${dataPath}.data`}
                    data={blocData}
                    key={`${id}-${field.name}`}
                    field={field}></FieldRenderer>
            ))}
        </div>
    );
});
