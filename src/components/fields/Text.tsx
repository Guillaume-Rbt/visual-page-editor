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
const textFieldClasses = "border-1 border-dark/20 p-2 focus:outline-none";
function TextComponent({ value, onChange, multiline }: ComponentProps) {
  const Field = multiline ? (
    <textarea
      className={`${textFieldClasses}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <input
      className={`${textFieldClasses}`}
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
  console.log(value, options);

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
