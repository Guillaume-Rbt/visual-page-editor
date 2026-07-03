import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import ArrowIcon from "../../assets/imgs/arrow.svg?react";
import useBoolean from "../../hooks/useBoolean";
import { ComponentDefinition } from "../../types";

export default function Select({
    options,
    onChange,
    value,
    placeholder = "",
    hoverable = true,
    layout = "column",
    classes = "",
    selectedRenderer,
}: {
    options: { value: string | number | ComponentDefinition; render: () => React.ReactNode }[];
    onChange: (value: any) => void;
    hoverable?: boolean;
    placeholder?: string;
    value?: any;
    classes?: string;
    selectedRenderer?: (opt: {
        value: string | number | ComponentDefinition;
        render: () => React.ReactNode;
    }) => React.ReactNode;
    layout?:
        | "column"
        | {
              cols: 3;
          };
}) {
    const [isOpen, open, close, toggle] = useBoolean(false);
    const handlerRef = useRef(null as HTMLDivElement | null);
    const listRef = useRef(null as HTMLDivElement | null);
    const selectedOption = useMemo(() => {
        return options.find((option) => option.value === value || `${option.value}` === `${value}`);
    }, [options, value]);
    const handleDocumentClick = useCallback(
        (e: MouseEvent) => {
            if (isOpen && !((e.target as HTMLElement).closest(".list-handler") === handlerRef.current)) {
                close();
            }
        },
        [isOpen, close],
    );

    const handleSelect = (value: string | number | ComponentDefinition) => {
        onChange(value);
        close();
    };

    useLayoutEffect(() => {
        let ro = null as unknown as ResizeObserver;
        document.addEventListener("click", handleDocumentClick);
        document.addEventListener("contextmenu", handleDocumentClick);

        if (listRef.current && handlerRef.current) {
            ro = new ResizeObserver(() => {
                if (listRef.current && handlerRef.current) {
                    const w = Math.max(handlerRef.current.offsetWidth, listRef.current.offsetWidth);
                    listRef.current.style.width = `${w}px`;
                    handlerRef.current.style.width = `${w}px`;
                }
            });

            ro.observe(handlerRef.current);
            ro.observe(listRef.current);
        }

        return () => {
            ro?.disconnect();
            ro = null as unknown as ResizeObserver;
            document.removeEventListener("click", handleDocumentClick);
            document.removeEventListener("contextmenu", handleDocumentClick);
        };
    }, [handleDocumentClick, isOpen]);

    return (
        <div className='flex relative flex-col'>
            <div
                onClick={() => {
                    toggle();
                }}
                ref={handlerRef}
                className={`relative box-border list-handler flex items-center p-2  ${classes} ${isOpen ? "shadow-[0_0_0_1px_var(--colors-dark)_inset]" : "bordered-input"}`}>
                {selectedOption ? (
                    selectedRenderer ? (
                        selectedRenderer(selectedOption)
                    ) : (
                        selectedOption.render()
                    )
                ) : (
                    <span className='text-gray-500'>{placeholder}</span>
                )}
                <ArrowIcon className={`right-2 transition-transform ml-auto ${isOpen ? "rotate-180" : ""}`} />
            </div>{" "}
            <div
                ref={listRef}
                style={{ gridTemplateColumns: layout == "column" ? "1fr" : `repeat(${layout.cols}, 1fr)` }}
                className={`gap-2 grid  min-w-full  top-full left-0 bg-white border border-gray-300 z-10 ${isOpen ? "opacity-100 pointer-events-auto p-2 h-auto absolute" : "opacity-0 pointer-events-none p-0 border-0 h-0"}`}>
                {options.map((option) => (
                    <div
                        key={option.value.toString()}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(option.value);
                        }}
                        className={`w-full text-left  cursor-pointer ${selectedOption?.value === option.value || `${selectedOption?.value}` === `${option.value}` ? "bg-primary/5" : ""}  ${hoverable ? "hover:bg-primary/10" : ""} p-1 rounded-2`}>
                        {option.render()}
                    </div>
                ))}
            </div>
        </div>
    );
}
