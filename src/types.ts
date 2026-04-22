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
  fields: { name: string; options: FieldOptions }[];
  category: string;
};

export type FieldDefinition<Options, Value = any> = {
  name: string;
  options: FieldOptions;
  render: FieldComponent<Options, Value>;
};

export type FieldComponent<FieldOptions, FieldValue> = FunctionComponent<{
  value: FieldValue;
  onChange: (v: FieldValue) => void;
  options: FieldOptions;
}>;

export type Translation = {
  addComponent: string;
  iconFor: string;
};

export type Value = {
  name: string;
  data: Record<string, any>;
};
