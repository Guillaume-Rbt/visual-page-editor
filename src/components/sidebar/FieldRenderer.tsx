import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { type ComponentValue } from "../../types";
import { isDataRef } from "../../utils/utils";

function isPromiseLike(value: unknown): value is Promise<unknown> {
    return value instanceof Promise;
}

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
    const [resolvedAsyncOptions, setResolvedAsyncOptions] = useState<Record<string, unknown>>({});

    useEffect(() => {
        let cancelled = false;

        const asyncEntries = Object.entries(field.options).filter(([, value]) => isPromiseLike(value));

        if (asyncEntries.length === 0) {
            setResolvedAsyncOptions({});
            return;
        }

        setResolvedAsyncOptions({});

        asyncEntries.forEach(([key, promise]) => {
            Promise.resolve(promise)
                .then((value) => {
                    if (cancelled) return;
                    setResolvedAsyncOptions((prev) => ({ ...prev, [key]: value }));
                })
                .catch(() => {
                    if (cancelled) return;
                    setResolvedAsyncOptions((prev) => ({ ...prev, [key]: undefined }));
                });
        });

        return () => {
            cancelled = true;
        };
    }, [field.options]);

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

    const hasPendingAsyncOptions = useMemo(() => {
        return Object.entries(field.options).some(
            ([key, value]) => isPromiseLike(value) && !Object.prototype.hasOwnProperty.call(resolvedAsyncOptions, key),
        );
    }, [field.options, resolvedAsyncOptions]);

    const fieldOptions = useMemo(() => {
        const options = Array.isArray(field.options) ? [...field.options] : { ...field.options };

        Object.entries(options).forEach(([key, optionValue]) => {
            let nextValue = optionValue;

            if (Object.prototype.hasOwnProperty.call(resolvedAsyncOptions, key)) {
                nextValue = resolvedAsyncOptions[key];
            }

            if (isDataRef(nextValue)) {
                nextValue = data[nextValue.key];
            }

            (options as Record<string, unknown>)[key] = nextValue;
        });

        return options;
    }, [data, field.options, resolvedAsyncOptions]);

    if (hasPendingAsyncOptions) {
        return null;
    }

    const enabled = fieldOptions.enabled;
    const isEnabled = typeof enabled === "function" ? enabled(data) : enabled !== false;

    return (
        <div className={`w-full ${!isEnabled ? "opacity-50 pointer-events-none" : ""}`}>
            <Component
                enabled={isEnabled}
                options={fieldOptions}
                value={field.group ? data : data[field.name]}
                onChange={handleChange}
            />
        </div>
    );
});
