import { translation } from "../../visual-editor";

export function Search({
    onChange,
    value,
    placeholder,
    width = "30rem",
}: {
    onChange: (value: string) => void;
    value: string;
    placeholder?: string;
    width?: string;
}) {
    return (
        <input
            placeholder={translation("searchComponentPlaceholder")}
            type='text'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className='.focus\:border-ve-primary\/20:focus max-md:w-full max-w-full font-600 bordered-input p-2 rounded-full'
            style={{ width: width }}
        />
    );
}
