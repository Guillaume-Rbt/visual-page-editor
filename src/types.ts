import { FunctionComponent } from "react";

export interface FieldOptions {
  description?: string;
  label: string;
}

export interface FieldOptions {
  defaultValue?: any;
}

export type BlocDefinition = {
  name: string;
  fields: { name: string; options: {} }[];
  category: string;
};

export type FieldDefinition<Options, Value = any> = {
  name: string;
  options: Options;
  render: FieldComponent<Options, Value>;
};

export type FieldComponent<FieldOptions, FieldValue> = FunctionComponent<{
  value: FieldValue;
  onChange: (v: FieldValue) => void;
  options: FieldOptions;
}>;

export type Translation = {
  addComponent: string;
};
