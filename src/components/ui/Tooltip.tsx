import { cloneElement, ReactElement, RefObject, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useBoolean from "../../hooks/useBoolean";

type TooltipPos = "top" | "bottom" | "left" | "right";
type TooltipAxis = "y" | "x";

type TooltipChildProps = {
    ref?: React.Ref<HTMLElement>;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
};

export function Tooltip({
    children,
    text,
    axis = "y",
    force,
}: {
    text: string;
    children: ReactElement<TooltipChildProps>;
    axis?: TooltipAxis;
    force?: TooltipPos;
}) {
    const [displayed, display, hide] = useBoolean(false);
    const target = useRef<HTMLElement | null>(null);

    return (
        <>
            {cloneElement(children, {
                ref: target,
                onMouseEnter: (e) => {
                    children.props.onMouseEnter?.(e);
                    display();
                },
                onMouseLeave: (e) => {
                    children.props.onMouseLeave?.(e);
                    hide();
                },
            })}

            {createPortal(
                <TooltipRender target={target} force={force} displayed={displayed} text={text} axis={axis} />,
                document.body,
            )}
        </>
    );
}

function TooltipRender({
    target,
    text,
    displayed,
    axis,
    force,
}: {
    target: RefObject<HTMLElement | null>;
    text: string;
    displayed: boolean;
    axis: TooltipAxis;
    force?: TooltipPos;
}) {
    const element = useRef<HTMLDivElement>(null);

    const [pos, setPos] = useState<TooltipPos>(force ?? (axis === "y" ? "top" : "right"));

    const [coords, setCoords] = useState({
        top: 0,
        left: 0,
    });

    const updateCoords = (next: { top: number; left: number }) => {
        setCoords((prev) => {
            if (prev.top === next.top && prev.left === next.left) return prev;
            return next;
        });
    };

    useLayoutEffect(() => {
        if (!target.current || !element.current) return;

        const t = target.current;
        const el = element.current;

        const targetBounding = t.getBoundingClientRect();
        const elementBounding = el.getBoundingClientRect();

        const positions = {
            y: {
                top: targetBounding.top - elementBounding.height - 10,
                bottom: targetBounding.bottom + 10,
            },
            x: {
                left: targetBounding.left - elementBounding.width - 10,
                right: targetBounding.right + 10,
            },
        };

        switch (axis) {
            case "y":
                const left = targetBounding.left + targetBounding.width / 2 - elementBounding.width / 2;

                if (force) {
                    updateCoords({
                        left: left,
                        top: positions["y"][force as "top" | "bottom"],
                    });
                    break;
                }
                switch (pos) {
                    case "bottom":
                        if (positions.y.bottom < window.innerHeight - 10) {
                            updateCoords({
                                left,
                                top: positions.y.bottom,
                            });

                            break;
                        }
                    case "top":
                        if (positions.y.top > 10) {
                            setPos("top");

                            updateCoords({
                                left,
                                top: positions.y.top,
                            });

                            break;
                        }
                        setPos("bottom");
                        updateCoords({
                            left,
                            top: positions.y.bottom,
                        });
                }
                break;
            case "x": {
                const top = targetBounding.top + targetBounding.height / 2 - elementBounding.height / 2;

                if (force) {
                    updateCoords({
                        top,
                        left: positions["x"][force as "left" | "right"],
                    });
                    break;
                }

                switch (pos) {
                    case "left":
                        if (positions.x.left > 10) {
                            updateCoords({
                                top,
                                left: positions.x.left,
                            });

                            break;
                        }

                    case "right":
                        if (positions.x.right + elementBounding.width < window.innerWidth - 10) {
                            setPos("right");

                            updateCoords({
                                top,
                                left: positions.x.right,
                            });

                            break;
                        }

                        setPos("left");
                        updateCoords({
                            top,
                            left: positions.x.left,
                        });

                        break;
                }

                break;
            }
        }
    }, [displayed, text]);

    return (
        <div
            ref={element}
            data-axis={axis}
            data-pos={pos}
            className={`pointer-events-none fixed z-9999 text-3.5 py-1.5 px-2 bg-dark text-light rounded-1 tooltip ${
                displayed ? "displayed" : ""
            }`}
            style={{
                top: coords.top + "px",
                left: coords.left + "px",
            }}>
            <p dangerouslySetInnerHTML={{ __html: text }}></p>
        </div>
    );
}
