import { FunctionComponent } from "react";

/**
 * A reference to a sibling data field resolved at render time.
 * Use the `ref<T>(key)` helper to create one.
 */
export type DataRef<T> = {
    readonly __isDataRef: true;
    readonly key: string;
};

export interface FieldProps {
    description?: string;
    label: string;
    enabled?: boolean;
}

export interface FieldOptions {
    defaultValue?: any;
    enabled?: boolean | ((data: Record<string, any>) => boolean);
    [key: string]: any;
}

export type ComponentDefinition = {
    name: string;
    label: string;
    fields: { name?: string; options: FieldOptions; group?: boolean }[];
    usableInSlot?: boolean;
    category: string;
};

export type FieldDefinition<Options extends FieldOptions, Value = any> = {
    name: string;
    options: Options;
    render: FieldComponent<Options, Value>;
};

export type FieldsdGroupDefinition<Options extends FieldOptions, Value> = {
    group: true;
    options: Options;
    render: FieldsGroupComponent<Options, Value>;
    name: string;
};

export type FieldComponent<Options extends FieldOptions, FieldValue> = FunctionComponent<{
    value: FieldValue;
    onChange: (v: FieldValue) => void;
    options: Options;
}>;

export type FieldsGroupComponent<Options extends FieldOptions, FieldValue> = FunctionComponent<{
    value: FieldValue;
    onChange: (v: FieldValue) => void;
    options: Options;
}>;
export type Translation = Record<string, string> & {
    addComponent: string;
    iconFor: string;
    slotAddComponent: string;
};

export type ComponentValue = {
    _name: string;
    _id: string;
    data: Record<string, any>;
};

export type Device = {
    name: string;
    type: "desktop" | "tablet" | "mobile";
    size: [number | string, number | string];
    orientation?: "portrait" | "landscape";
    default?: boolean;
};
