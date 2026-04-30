import { BlocValue, FieldComponent, FieldDefinition, Translation } from "../types";
import { VisualEditor } from "../visual-editor";

export function defineField<Options, Value>(args: {
    defaultOptions: Partial<Options>;
    render: FieldComponent<Options, Value>;
}) {
    return (name: string, options = {} as Options): FieldDefinition<Options, Value> => {
        const mergedOptions = { ...args.defaultOptions, ...options };
        return {
            ...args,
            name,
            options: mergedOptions,
        };
    };
}

export function translation(key: keyof Translation): string {
    return VisualEditor.lang[key];
}

export function setDeepValue(obj: any, keys: string[], value: unknown): any {
    const [key, ...rest] = keys;

    const clone = Array.isArray(obj) ? [...obj] : { ...obj };

    if (rest.length === 0) {
        clone[Array.isArray(clone) ? Number(key) : key] = value;
        return clone;
    }

    const realKey = Array.isArray(clone) ? Number(key) : key;

    clone[realKey] = setDeepValue(clone[realKey], rest, value);

    return clone;
}
