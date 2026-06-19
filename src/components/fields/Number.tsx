import { useEffect, useCallback, useState } from "react";
import ChevronIcon from "../../assets/imgs/arrow.svg?react";
import useBoolean from "../../hooks/useBoolean";
import { FieldComponent } from "../../types";
import { defineField } from "../../visual-editor";
import { Field } from "./Field";

type FieldArgs = {
    label: string;
    description?: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    each?: number;
    suffix?: string;
};

type NumberComponentProps = {
    value: number;
    each: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    suffix?: string;
};

const defaultOptions = {
    defaultValue: 0,
    max: Infinity,
    min: -Infinity,
    each: 1,
    suffix: "",
};

function NumberComponent({ value, onChange, each, max, min }: NumberComponentProps) {
    const [active, setActiveTrue, setActiveFalse] = useBoolean(false);
    const [action, setAction] = useState<"increment" | "decrement" | null>(null);
    const [inputValue, setInputValue] = useState(String(value));

    const allowDecimals = !Number.isInteger(each);
    const decimals = `${each}`.split(".")[1]?.length ?? 0;

    useEffect(() => {
        setInputValue(String(value));
    }, [value]);

    const update = useCallback(
        (type: "increment" | "decrement") => {
            const nextValue = type === "increment" ? Math.min(value + each, max) : Math.max(value - each, min);

            onChange(Number(nextValue.toFixed(decimals)));
        },
        [value, each, min, max, decimals, onChange],
    );

    useEffect(() => {
        if (!active || !action) return;

        const interval = setInterval(() => {
            update(action);
        }, 100);

        return () => clearInterval(interval);
    }, [active, action, update]);

    const stop = () => {
        setAction(null);
        setActiveFalse();
    };

    const onInput = (v: string) => {
        const regex = allowDecimals ? /^-?\d*(\.\d*)?$/ : /^-?\d*$/;

        if (!regex.test(v)) return;

        setInputValue(v);

        if (v === "" || v === "-" || (allowDecimals && (v === "." || v === "-."))) {
            return;
        }

        const num = Number(v);

        if (Number.isNaN(num)) return;

        onChange(Math.min(Math.max(num, min), max));
    };

    return (
        <div className='w-full flex relative bordered-input p-is-2'>
            <input type='text' value={inputValue} onChange={(e) => onInput(e.target.value)} className='flex-grow' />

            <div
                onMouseLeave={stop}
                className='flex flex-col  border-1 border-solid border-transparent hover:border-primary'>
                <button
                    type='button'
                    onMouseDown={() => {
                        update("increment");
                        setAction("increment");
                        setActiveTrue();
                    }}
                    onMouseUp={stop}
                    className='hover:bg-primary/10'>
                    <ChevronIcon className='w-6 rotate-180' />
                </button>

                <button
                    type='button'
                    onMouseDown={() => {
                        update("decrement");
                        setAction("decrement");
                        setActiveTrue();
                    }}
                    onMouseUp={stop}
                    className='hover:bg-primary/10'>
                    <ChevronIcon className='w-6' />
                </button>
            </div>
        </div>
    );
}

const Component: FieldComponent<FieldArgs & typeof defaultOptions, number> = ({ value, onChange, options }) => {
    return (
        <Field label={options.label} description={options.description}>
            <NumberComponent
                value={value}
                each={options.each}
                max={options.max}
                min={options.min}
                onChange={onChange}
                suffix={options.suffix}
            />
        </Field>
    );
};

export const NumberField = defineField<FieldArgs, number, typeof defaultOptions>({
    defaultOptions,
    render: Component,
});
