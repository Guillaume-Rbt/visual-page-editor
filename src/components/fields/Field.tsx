import { type FieldProps } from "../../types";

export function Field({
    description,
    children,
    label,
    enabled = true,
}: FieldProps & {
    children: React.ReactNode;
}) {
    return (
        <div
            className={`w-full flex flex-col ${!enabled ? "opacity-0 pointer-events-none" : ""}`}>
            <p className='font-500 text-dark/60 text-4.2 mb-2'>{label}</p>
            {description && (
                <p className='text-dark/70 text-3.5 font-italic'>
                    {description}
                </p>
            )}
            {children}
        </div>
    );
}
