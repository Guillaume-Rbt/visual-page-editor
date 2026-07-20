import { Ref, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import ArrowIcon from "../../assets/imgs/arrow.svg?react";
import useBoolean from "../../hooks/useBoolean";
import { ComponentDefinition } from "../../types";

export function Select({
    options,
    onChange,
    value,
    placeholder = "",
    hoverable = true,
    layout = "column",
    mode = "default",
    selectedRenderer,
    ref,
    listMaxHeight = 100,
    ...props
}: {
    options: { value: string | number | ComponentDefinition; render: () => React.ReactNode }[];
    onChange: (value: any) => void;
    hoverable?: boolean;
    placeholder?: string;
    listMaxHeight?: string | number;
    value?: any;
    mode?: "default" | "menu";
    selectedRenderer?: (opt: {
        value: string | number | ComponentDefinition;
        render: () => React.ReactNode;
    }) => React.ReactNode;
    layout?:
        | "column"
        | {
              cols: number;
              width?: number | string;
          };
    ref?: Ref<HTMLDivElement>;
}) {
    const mHeight = listMaxHeight
        ? typeof listMaxHeight === "number"
            ? `calc(${listMaxHeight} * var(--spacing))`
            : listMaxHeight
        : "300px";

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
                    if (isOpen || mode === "menu") return;
                    listRef.current.style.width = "auto";
                    handlerRef.current.style.width = "auto";
                    const w = Math.max(handlerRef.current.offsetWidth, listRef.current.offsetWidth);
                    listRef.current.style.width = `${w}px`;
                    handlerRef.current.style.width = `${w}px`;
                }
            });

            ro.observe(window.document.body);
        }

        return () => {
            ro?.disconnect();
            ro = null as unknown as ResizeObserver;
            document.removeEventListener("click", handleDocumentClick);
            document.removeEventListener("contextmenu", handleDocumentClick);
        };
    }, [handleDocumentClick]);

    return (
        <div className='flex relative flex-col'>
            <div ref={ref} {...props}>
                <div
                    onClick={() => {
                        toggle();
                    }}
                    ref={handlerRef}
                    className={`gap-2 relative box-border cursor-pointer list-handler flex items-center p-2 ${isOpen ? "shadow-[0_0_0_1px_var(--colors-dark)_inset]" : "bordered-input"} `}>
                    {selectedOption ? (
                        selectedRenderer ? (
                            selectedRenderer(selectedOption)
                        ) : (
                            selectedOption.render()
                        )
                    ) : (
                        <span className='text-gray-500'>{placeholder}</span>
                    )}
                    <ArrowIcon
                        className={`right-2 text-4 shrink-0 transition-transform ml-auto ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </div>

            <div
                onMouseOver={(e) => {
                    e.stopPropagation();
                }}
                ref={listRef}
                style={{
                    gridTemplateColumns:
                        layout == "column" ? "1fr" : `repeat(${layout.cols}, ${layout.width ?? "1fr"})`,
                    maxHeight: mHeight,
                }}
                className={`overflow-auto gap-2 grid border-x-1 border-dark/30  min-w-full  top-full left-0 bg-white  z-10 px-2 ${isOpen ? "opacity-100 pointer-events-auto py-2 h-auto absolute border-y-1" : "opacity-0 pointer-events-none py-0  h-0 border-y-0"} ${mode == "menu" ? "absolute" : ""}`}>
                {options.map((option) => (
                    <div
                        key={option.value.toString()}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(option.value);
                        }}
                        className={`w-full text-left  cursor-pointer ${selectedOption?.value === option.value || `${selectedOption?.value}` === `${option.value}` ? "bg-primary/5" : ""}  ${hoverable ? "hover:bg-primary/10" : ""} ${layout == "column" ? "mr-4 p-1" : ""} rounded-2`}>
                        {option.render()}
                    </div>
                ))}
            </div>
        </div>
    );
}
