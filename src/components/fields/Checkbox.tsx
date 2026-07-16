import { FieldComponent } from "../../types";
import { defineField } from "../../visual-editor";

function CheckboxComponent({
    value,
    onChange,
    label,
}: {
    value: boolean;
    onChange: (value: boolean) => void;
    label?: string;
}) {
    return (
        <label className='flex items-center gap-2 group cursor-pointer select-none'>
            <input type='checkbox' className='hidden' checked={value} onChange={(e) => onChange(e.target.checked)} />
            <div
                className={`  w-11 h-6 relative rounded-7 transition-all ${value ? "bg-primary group-hover:bg-primary/90" : "bg-primary/20 group-hover:bg-primary/40"}`}>
                <div
                    className={`h-4 w-4 absolute top-1 left-1 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0"}`}></div>
            </div>
            {label && <span>{label}</span>}
        </label>
    );
}

const Component: FieldComponent<{ label?: string }, boolean> = ({ value, onChange, options }) => {
    return <CheckboxComponent value={value} onChange={onChange} label={options.label}></CheckboxComponent>;
};

export const Checkbox = defineField<{ label?: string; defaultValue?: boolean }, boolean>({
    defaultOptions: {
        defaultValue: false,
        label: "",
    },
    render: Component,
});
