import { type FieldOptions } from "../../types";

export function Field({
  description,
  children,
  label,
}: FieldOptions & {
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
