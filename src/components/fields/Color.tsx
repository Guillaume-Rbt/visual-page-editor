import useBoolean from "../../hooks/useBoolean";
import { FieldComponent } from "../../types";
import { defineField } from "../../visual-editor";
import { Field } from "./Field";
import TransparentIcon from "../../assets/imgs/transparent.svg?react";

type FieldArgs = {
    colors: string[];
    label: string;
    defaultValue: string;
    description?: string;
};

type ComponentProps = {
    colors: string[];
    value: string;
    onChange: (v: string) => void;
};

const defaultOptions = {
    defaultValue: "",
};

function ColorComponent({ colors, value, onChange }: ComponentProps) {
    const [opened, open, close, toggle] = useBoolean(false);

    const onUpdate = (c: string) => {
        onChange(c);
        close();
    };

    return (
        <div className='relative'>
            <div
                style={{ gridTemplateColumns: `repeat(${Math.min(colors.length, 5)}, auto)` }}
                className={`absolute grid  rounded-2 gap-1 p-2 left-0 top-0 translate-y-[-110%] bg-dark ${opened ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                {colors.map((c) => {
                    return (
                        <button
                            onClick={() => {
                                onUpdate(c);
                            }}
                            className={`w-5 h-5 rounded-1 overflow-hidden cursor-pointer border-1 border-solid border-white/30 ${c == "none" ? "no-color" : ""}`}
                            style={{
                                background: c,
                            }}
                            key={c}>
                            {c == "transparent" && <TransparentIcon className='w-full h-full'></TransparentIcon>}
                        </button>
                    );
                })}
            </div>
            <button
                style={{ background: value }}
                className='w-7 h-7 border-1 rounded-2 border-solid border-dark/20 cursor-pointer overflow-hidden'
                onClick={toggle}>
                {value == "transparent" && <TransparentIcon className='w-full h-full'></TransparentIcon>}
            </button>
        </div>
    );
}

const Component: FieldComponent<FieldArgs & typeof defaultOptions, string> = ({ value, onChange, options }) => {
    return (
        <Field label={options.label} description={options.description}>
            <ColorComponent colors={options.colors} value={value} onChange={onChange} />
        </Field>
    );
};

export const Color = defineField<FieldArgs, string, typeof defaultOptions>({
    defaultOptions,
    render: Component,
});
