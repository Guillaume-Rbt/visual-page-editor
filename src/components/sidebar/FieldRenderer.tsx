import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type ComponentValue } from "../../types";
import { isDataRef, isPromiseLike } from "../../utils/utils";

function evaluateOption(value: unknown, data: ComponentValue["data"]) {
    if (isDataRef(value)) return data[value.key];
    if (typeof value === "function") return value(data);
    return value;
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
    onChange: (v: unknown, path: string) => void;
}) {
    const Component = field.render;
    const [resolvedAsyncOptions, setResolvedAsyncOptions] = useState<
        Record<string, { value: unknown }>
    >({});
    const requested = useRef<Record<string, PromiseLike<unknown>>>({});
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    // Resolves refs and functions; the result may still be a promise.
    const evaluatedOptions = useMemo(() => {
        const options: Record<string, unknown> = {};

        Object.entries(field.options).forEach(([key, optionValue]) => {
            options[key] = evaluateOption(optionValue, data);
        });

        return options;
    }, [data, field.options]);

    useEffect(() => {
        Object.entries(evaluatedOptions).forEach(([key, optionValue]) => {
            if (!isPromiseLike(optionValue)) {
                delete requested.current[key];
                return;
            }

            if (requested.current[key] === optionValue) return;
            requested.current[key] = optionValue;

            const store = (value: unknown) => {
                if (!mounted.current || requested.current[key] !== optionValue)
                    return;
                setResolvedAsyncOptions((prev) =>
                    prev[key] && prev[key].value === value
                        ? prev
                        : { ...prev, [key]: { value } },
                );
            };

            Promise.resolve(optionValue).then(store, () => store(undefined));
        });
    }, [evaluatedOptions]);

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

    const { fieldOptions, hasPendingAsyncOptions } = useMemo(() => {
        const options = Array.isArray(field.options)
            ? [...field.options]
            : { ...field.options };
        let pending = false;

        Object.entries(evaluatedOptions).forEach(([key, optionValue]) => {
            let nextValue = optionValue;

            if (isPromiseLike(optionValue)) {
                const resolved = resolvedAsyncOptions[key];

                if (!resolved) {
                    pending = true;
                    return;
                }

                // Previously resolved values are kept while a new promise is pending.
                nextValue = evaluateOption(resolved.value, data);
                if (isPromiseLike(nextValue)) nextValue = undefined;
            }

            (options as Record<string, unknown>)[key] = nextValue;
        });

        return { fieldOptions: options, hasPendingAsyncOptions: pending };
    }, [data, evaluatedOptions, field.options, resolvedAsyncOptions]);

    if (hasPendingAsyncOptions) {
        return null;
    }

    const enabled = fieldOptions.enabled;
    const isEnabled = enabled !== false;

    const resolvedValue = field.group ? data : data[field.name];
    const value =
        !field.group &&
        resolvedValue === undefined &&
        fieldOptions.defaultValue != null
            ? fieldOptions.defaultValue
            : resolvedValue;

    return (
        <div
            className={`w-full ${!isEnabled ? "opacity-50 pointer-events-none" : ""}`}>
            <Component
                enabled={isEnabled}
                options={fieldOptions}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
});
