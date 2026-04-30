import { useCallback } from "react";
import { type BlocValue } from "../../types";
import { usePartialStore } from "../../Store";

export function FieldRenderer({ field, data, dataPath }: { field: any; data: BlocValue; dataPath: string }) {
    const { updateData } = usePartialStore("updateData");
    const Component = field.render;

    const handleChange = useCallback(
        (v: unknown) => {
            updateData(v, `${dataPath}.data.${field.name}`);
        },
        [dataPath, updateData],
    );

    return <Component options={field.options} value={data.data[field.name]} onChange={handleChange} />;
}
