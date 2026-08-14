import { translation } from "../../visual-editor";

export function Search({
    onChange,
    value,
    placeholder,
}: {
    onChange: (value: string) => void;
    value: string;
    placeholder?: string;
}) {
    return (
        <input
            placeholder={translation("searchComponentPlaceholder")}
            type='text'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className='.focus\:border-ve-primary\/20:focus max-md:w-full w-[50%] font-600 bordered-input p-2 rounded-full'
        />
    );
}
