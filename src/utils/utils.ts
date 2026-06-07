import { v4 } from "uuid";
import { FieldComponent, FieldDefinition, FieldsdGroupDefinition, FieldsGroupComponent, Translation } from "../types";
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
type OptionsWithFields = {
    fields: FieldDefinition<any, any>[];
};
export function defineFieldsGroup<Options extends OptionsWithFields | OptionsWithFields[], Value>(
    render: FieldsGroupComponent<Options, Value>,
) {
    return (options = {} as Options): FieldsdGroupDefinition<Options, Value> => {
        let name = "";

        const fields = Array.isArray(options) ? options.flatMap((obj) => obj.fields) : options.fields;

        if (options != null && typeof options == "object") {
            name = "name" in options ? (options.name as string) : fields.map((f) => f.name).join("-");
        }
        return {
            group: true,
            render: render,
            options: options,
            name: name,
            ...options,
        } as FieldsdGroupDefinition<Options, Value>;
    };
}

export function translation(key: keyof Translation): string {
    return VisualEditor.lang[key];
}

export function setDeepValue(obj: any, keys: string[], data: unknown): any {
    const [key, ...rest] = keys;

    const clone = Array.isArray(obj) ? [...obj] : { ...obj };
    if (Array.isArray(clone)) {
        const index = Number(key);
        if (!Number.isNaN(index)) {
            if (rest.length === 0) {
                clone[index] = data;
                return clone;
            }

            clone[index] = setDeepValue(clone[index], rest, data);
            return clone;
        }

        const itemIndex = clone.findIndex((item) => item && item._id === key);
        if (itemIndex === -1) {
            return clone;
        }

        if (rest.length === 0) {
            clone[itemIndex] = data;
            return clone;
        }

        clone[itemIndex] = setDeepValue(clone[itemIndex], rest, data);
        return clone;
    }

    if (rest.length === 0) {
        clone[key] = data;
        return clone;
    }

    clone[key] = setDeepValue(clone[key], rest, data);

    return clone;
}

export function debounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

export function stringifyValue(v: number | string | string[] | number[]): string {
    return Array.isArray(v) ? v.join(" ") : `${v}`;
}

export function insertIntoArray<T>(array: T[], index: number, value: T): T[] {
    return [...array.slice(0, index), value, ...array.slice(index)];
}

export function deleteFromArray<T>(array: T[], index: number): T[] {
    return [...array.slice(0, index), ...array.slice(index + 1)];
}
