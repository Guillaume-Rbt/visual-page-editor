import { FunctionComponent } from "react";

export interface FieldProps {
    description?: string;
    label: string;
}

export interface FieldOptions {
    defaultValue?: any;
    [key: string]: any;
}

export type BlocDefinition = {
    name: string;
    label: string;
    fields: { name?: string; options: FieldOptions; group?: boolean }[];
    usableInSlot?: boolean;
    category: string;
};

export type FieldDefinition<Options, Value = any> = {
    name: string;
    options: FieldOptions;
    render: FieldComponent<Options, Value>;
};

export type FieldsdGroupDefinition<Options, Value> = {
    group: true;
    options: Options;
    render: FieldsGroupComponent<Options, Value>;
} & (Options extends { name: infer Name extends string } ? { name: Name } : {});

export type FieldComponent<FieldOptions, FieldValue> = FunctionComponent<{
    value: FieldValue;
    onChange: (v: FieldValue) => void;
    options: FieldOptions;
}>;

export type FieldsGroupComponent<FieldOptions, FieldValue> = FunctionComponent<{
    value: FieldValue;
    onChange: (v: FieldValue) => void;
    options: FieldOptions;
}>;
export type Translation = Record<string, string> & {
    addComponent: string;
    iconFor: string;
    slotAddComponent: string;
};

export type BlocValue = {
    _name: string;
    _id: string;
    data: Record<string, any>;
};
