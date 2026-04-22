import { defineField } from "../../utils/utils";
import { FieldComponent } from "../../types";
import { Field } from "./Field";

type fieldsArgs = {
  label: string;
  description: string;
  multiline: boolean;
  defaultValue: string;
};

type ComponentProps = {
  value: string;
  onChange: (v: string) => void;
  multiline: boolean;
};

function TextComponent({ value, onChange, multiline }: ComponentProps) {
  const Field = multiline ? (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );

  return <>{Field}</>;
}

const Component: FieldComponent<fieldsArgs, string> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <Field label={options.label} description={options.description}>
      <TextComponent
        multiline={options.multiline}
        value={value}
        onChange={onChange}
      />
    </Field>
  );
};

export const Text = defineField<fieldsArgs, string>({
  defaultOptions: {
    multiline: false,
    defaultValue: "",
  },
  render: Component,
});
