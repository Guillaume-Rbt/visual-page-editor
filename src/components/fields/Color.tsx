import useBoolean from "../../hooks/useBoolean";
import { FieldComponent, ValueFieldOptions } from "../../types";
import { defineField } from "../../visual-editor";
import { Field } from "./Field";
import TransparentIcon from "../../assets/imgs/transparent.svg?react";
import { Tooltip } from "../ui/Tooltip";
import { ColorPicker } from "./ColorPicker/CustomColor";
import { debounce } from "../../utils/utils";

type FieldArgs = ValueFieldOptions<string> & {
    colors: string[] | { value: string; label: string }[];
    defaultValue: string;
    enableCustomColor?: boolean;
    position?: "bottom" | "top";
};

type ComponentProps = {
    colors: string[] | { value: string; label: string }[];
    value: string;
    enableCustomColor?: boolean;
    onChange: (v: string) => void;
    position?: "bottom" | "top";
};

const getColor = (color: string) => {
    const regex = /^(none|default|auto)$/;

    if (regex.test(color) || color === "") return "transparent";

    return color;
};

const defaultOptions = {
    defaultValue: "",
    enableCustomColor: false,
};

function ColorComponent({
    colors,
    value,
    position = "bottom",
    onChange,
    enableCustomColor,
}: ComponentProps) {
    const [opened, open, close, toggle] = useBoolean(false);
    useBoolean(false);

    const onUpdate = (c: string) => {
        onChange(c);
    };

    const normalizedColors = colors.map((c) => {
        if (typeof c === "string") {
            return { value: c, label: "" };
        }
        return c;
    });

    return (
        <div className='relative w-7 h-7'>
            <div
                className={`flex bordered-input flex-col-reverse flex-reverse bg-ve-light flex-items-start rounded-2 gap-1 p-2 left-0 absolute   ${opened ? "opacity-100" : "pointer-events-none opacity-0 hidden"} ${position == "bottom" ? "top-full" : "bottom-full"} z-10`}>
                <div
                    style={{
                        gridTemplateColumns: `repeat(${Math.min(colors.length, 5)}, auto)`,
                    }}
                    className={`grid gap-1`}>
                    {normalizedColors.map((c) => {
                        return (
                            <Tooltip text={c.label} key={c.value}>
                                <button
                                    onClick={() => {
                                        onUpdate(c.value);
                                    }}
                                    className={`w-5 h-5 rounded-1 overflow-hidden cursor-pointer border-1 border-solid border-ve-light/30`}
                                    style={{
                                        background: getColor(c.value),
                                    }}>
                                    {getColor(c.value) == "transparent" && (
                                        <TransparentIcon className='w-full h-full'></TransparentIcon>
                                    )}
                                </button>
                            </Tooltip>
                        );
                    })}
                </div>
                {enableCustomColor && (
                    <div className=''>
                        <ColorPicker
                            onChange={debounce((c: string) => onUpdate(c), 100)}
                            value={value}
                        />
                    </div>
                )}
            </div>
            <button
                style={{ background: getColor(value) }}
                className='w-full h-full top-0 left-0 absolute border-1 rounded-2 border-solid border-ve-dark/20 cursor-pointer overflow-hidden'
                onClick={toggle}>
                {getColor(value) == "transparent" && (
                    <TransparentIcon className='w-full h-full'></TransparentIcon>
                )}
            </button>
        </div>
    );
}

const Component: FieldComponent<FieldArgs & typeof defaultOptions, string> = ({
    value,
    onChange,
    options,
}) => {
    return (
        <Field label={options.label} description={options.description}>
            <ColorComponent
                colors={options.colors}
                value={value}
                onChange={onChange}
                position={options.position}
                enableCustomColor={options.enableCustomColor}
            />
        </Field>
    );
};

export const Color = defineField<FieldArgs, string, typeof defaultOptions>({
    defaultOptions,
    render: Component,
});
