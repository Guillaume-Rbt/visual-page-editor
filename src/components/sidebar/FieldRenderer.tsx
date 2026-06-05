import { memo, useCallback } from "react";
import { type BlocValue } from "../../types";

export const FieldRenderer = memo(function FieldRenderer({
    field,
    data,
    dataPath,
    onChange,
}: {
    field: any;
    data: BlocValue["data"];
    dataPath: string;
    onChange: Function;
}) {
    const Component = field.render;

    const handleChange = useCallback(
        (v: unknown) => {
            let path = "";

            if (field.group) {
                for (const k in v as { [key: string]: any }) {
                    path = `${dataPath}.${k}`;
                    const value = (v as { [key: string]: any })[k];

                    onChange(value, path);
                }
            } else {
                path = `${dataPath}.${field.name}`;
                onChange(v, path);
            }
        },
        [dataPath, onChange],
    );

    return <Component options={field.options} value={field.group ? data : data[field.name]} onChange={handleChange} />;
});
