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
      <p className="font-semibold text-4.2">{label}</p>
      {description && (
        <p className="text-dark/70 text-3.5 font-italic">{description}</p>
      )}
      {children}
    </div>
  );
}
