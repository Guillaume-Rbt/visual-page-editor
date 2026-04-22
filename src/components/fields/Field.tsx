import { type FieldProps } from "../../types";

export function Field({
  description,
  children,
  label,
}: FieldProps & {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col">
      <p>{label}</p>
      <p>{description}</p>
      {children}
    </div>
  );
}
