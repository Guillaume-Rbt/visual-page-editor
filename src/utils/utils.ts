import { FieldComponent, FieldDefinition, Translation } from "../types";
import { VisualEditor } from "../visual-editor";

export function defineField<Options, Value>(args: {
  defaultOptions: Partial<Options>;
  render: FieldComponent<Options, Value>;
}) {
  return (
    name: string,
    options = {} as Options,
  ): FieldDefinition<Options, Value> => {
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
