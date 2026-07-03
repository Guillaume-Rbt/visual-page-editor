import { memo, useCallback } from "react";
import { type ComponentValue } from "../../types";
import { isDataRef } from "../../utils/utils";

export const FieldRenderer = memo(function FieldRenderer({
    field,
    data,
    dataPath,
    onChange,
}: {
    field: any;
    data: ComponentValue["data"];
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

    let fieldOptions = field.options;
    for (const key in field.options) {
        const optValue = field.options[key];
        if (isDataRef(optValue)) {
            if (fieldOptions === field.options) fieldOptions = { ...fieldOptions };
            fieldOptions[key] = data[optValue.key];
        }
    }

    return <Component options={fieldOptions} value={field.group ? data : data[field.name]} onChange={handleChange} />;
});
