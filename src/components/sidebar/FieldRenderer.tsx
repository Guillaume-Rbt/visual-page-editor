import { memo, useCallback } from "react";
import { type BlocValue } from "../../types";
import { usePartialStore } from "../../Store";

export const FieldRenderer = memo(function FieldRenderer({
    field,
    data,
    dataPath,
    onChange
}: {
    field: any;
    data: BlocValue["data"];
    dataPath: string;
    onChange: Function
}) {
    const Component = field.render;

    const handleChange = useCallback(
        (v: unknown) => {
            onChange(v, `${dataPath}.${field.name}`);
        },
        [dataPath, onChange],
    );

    return <Component options={field.options} value={data[field.name]} onChange={handleChange} />;
});
