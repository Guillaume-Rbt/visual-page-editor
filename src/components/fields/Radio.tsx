import { ReactNode, useLayoutEffect, useMemo, useRef } from "react";

import { FieldComponent, ValueFieldOptions } from "../../types";

import { defineField } from "../../visual-editor";
import { Field } from "./Field";
import { isHTMLElement } from "../../utils/utils";
import { Tooltip } from "../ui/Tooltip";

export type RadioLabel = ReactNode | HTMLElement;

type RadioStateLabel = {
    checked: () => RadioLabel;
    unchecked: () => RadioLabel;
};

type RadioItemLabel =
    | RadioLabel
    | RadioStateLabel
    | ((checked: boolean) => RadioLabel);

function isRadioStateLabel(label: RadioItemLabel): label is RadioStateLabel {
    return (
        typeof label === "object" &&
        label !== null &&
        "checked" in label &&
        "unchecked" in label &&
        typeof label.checked === "function" &&
        typeof label.unchecked === "function"
    );
}

function RadioLabelRenderer({ value }: { value: RadioLabel }) {
    const containerRef = useRef<HTMLSpanElement | null>(null);

    useLayoutEffect(() => {
        if (!isHTMLElement(value) || !containerRef.current) {
            return;
        }

        const container = containerRef.current;

        container.replaceChildren(value);

        return () => {
            if (value.parentNode === container) {
                container.removeChild(value);
            }
        };
    }, [value]);

    return (
        <span ref={isHTMLElement(value) ? containerRef : undefined}>
            {isHTMLElement(value) ? null : value}
        </span>
    );
}

type FieldArgs = ValueFieldOptions<string> & {
    defaultValue: string;
    collapsed?: boolean;
    layout?: "row" | "col";

    options: {
        tooltip?: string;
        label: RadioItemLabel;
        value: string;
    }[];
};

const defaultOptions = {
    defaultValue: "",
    collapsed: false,
    layout: "col" as "row" | "col",
};

function RadioItem({
    label,
    checked,
    onChange,
    id,
    collapsed,
    tooltip,
}: {
    label: RadioItemLabel;
    checked: boolean;
    onChange: (id: number) => void;
    collapsed: boolean;
    id: number;
    tooltip?: string;
}) {
    const labelRenderer = useMemo(() => {
        if (isRadioStateLabel(label)) {
            return (
                <div className='grid'>
                    <div
                        className={`
                            col-start-1
                            row-start-1
                            transition-opacity
                            ${checked ? "opacity-100" : "opacity-0"}
                        `}>
                        <RadioLabelRenderer value={label.checked()} />
                    </div>

                    <div
                        className={`
                            col-start-1
                            row-start-1
                            transition-opacity
                            ${checked ? "opacity-0" : "opacity-100"}
                        `}>
                        <RadioLabelRenderer value={label.unchecked()} />
                    </div>
                </div>
            );
        }

        const value = typeof label === "function" ? label(checked) : label;

        return <RadioLabelRenderer value={value} />;
    }, [label, checked]);

    const element = (
        <label
            className={`
                flex
                items-center
                gap-2
                cursor-pointer
                ${checked ? "checked" : ""}
            `}>
            <input
                type='radio'
                className='hidden'
                checked={checked}
                onChange={() => onChange(id)}
            />

            {collapsed ? (
                <div
                    className={`
                        text-4
                        p-2
                        ${
                            checked
                                ? "bg-ve-primary text-ve-light"
                                : "bg-transparent text-ve-primary"
                        }
                    `}>
                    {labelRenderer}
                </div>
            ) : (
                <>
                    <div
                        className='
                            w-4
                            h-4
                            rounded-full
                            border-2
                            border-solid
                            border-ve-primary
                            transition-all
                            relative
                        '>
                        <div
                            className={`
                                absolute
                                rounded-full
                                inset-.5
                                ${checked ? "bg-ve-primary" : "bg-transparent"}
                            `}
                        />
                    </div>

                    {labelRenderer}
                </>
            )}
        </label>
    );

    if (tooltip) {
        return <Tooltip text={tooltip}>{element}</Tooltip>;
    }

    return element;
}

const Component: FieldComponent<FieldArgs & typeof defaultOptions, string> = ({
    value,
    onChange,
    options,
}) => {
    return (
        <Field label={options.label} description={options.description}>
            <div
                className={`
                    flex

                    ${
                        options.layout === "col" && !options.collapsed
                            ? "flex-col"
                            : "flex-row flex-wrap"
                    }

                    ${
                        options.collapsed
                            ? `
                                gap-0
                                border-solid
                                border-1
                                border-ve-primary
                                overflow-hidden
                                rounded-3
                                w-max
                            `
                            : options.layout === "col"
                              ? "gap-2"
                              : "gap-6"
                    }
                `}>
                {options.options.map((option, index) => (
                    <RadioItem
                        key={index}
                        id={index}
                        tooltip={option.tooltip}
                        collapsed={options.collapsed}
                        label={option.label}
                        checked={value === option.value}
                        onChange={(id) => onChange(options.options[id].value)}
                    />
                ))}
            </div>
        </Field>
    );
};

export const Radio = defineField<FieldArgs, string, typeof defaultOptions>({
    defaultOptions,
    render: Component,
});
