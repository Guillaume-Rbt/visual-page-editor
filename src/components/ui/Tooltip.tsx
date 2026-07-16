import { cloneElement, ReactElement, RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useBoolean from "../../hooks/useBoolean";

type TooltipPos = "top" | "bottom" | "left" | "right";
type TooltipAxis = "y" | "x";

type TooltipChildProps = {
    ref?: React.Ref<HTMLElement>;
    onMouseEnter?: React.MouseEventHandler;
    onMouseMove?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
};

export function Tooltip({
    children,
    text,
    axis = "y",
    force,
    positionAnchor = "element",
}: {
    text: string;
    children: ReactElement<TooltipChildProps>;
    axis?: TooltipAxis;
    force?: TooltipPos;
    positionAnchor?: "element" | "pointer";
}) {
    const [displayed, display, hide] = useBoolean(false);
    const target = useRef<HTMLElement | null>(null);
    const [pointerCoords, setPointerCoords] = useState(null as { x: number; y: number } | null);
    const to = useRef(null as number | null);

    return (
        <>
            {cloneElement(children, {
                ref: target,
                onMouseEnter: (e) => {
                    children.props.onMouseEnter?.(e);
                    if (positionAnchor === "pointer") {
                        to.current = window.setTimeout(() => {
                            display();
                        }, 500);

                        return;
                    }

                    display();
                },
                onMouseMove: (e) => {
                    children.props.onMouseMove?.(e);
                    const coords = { x: e.clientX, y: e.clientY };
                    if (positionAnchor === "pointer") {
                        setPointerCoords(coords);
                    }
                },

                onMouseLeave: (e) => {
                    children.props.onMouseLeave?.(e);
                    if (to.current) {
                        clearTimeout(to.current);
                        to.current = null;
                    }
                    hide();
                },
            })}

            {createPortal(
                <TooltipRender
                    target={target}
                    force={force}
                    displayed={displayed}
                    text={text}
                    axis={axis}
                    pointerCoords={pointerCoords}
                />,
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
    pointerCoords,
}: {
    target: RefObject<HTMLElement | null>;
    text: string;
    displayed: boolean;
    axis: TooltipAxis;
    force?: TooltipPos;
    pointerCoords: { x: number; y: number } | null;
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

    useEffect(() => {
        if (!target.current || !element.current) return;

        const t = target.current;
        const el = element.current;

        const targetBounding = t.getBoundingClientRect();
        const elementBounding = el.getBoundingClientRect();
        const positionRef = {
            x: {
                left: pointerCoords ? pointerCoords.x : targetBounding.left,
                right: pointerCoords ? window.innerWidth - pointerCoords.x : targetBounding.right,
            },
            y: {
                top: pointerCoords ? pointerCoords.y : targetBounding.top,
                bottom: pointerCoords ? window.innerHeight - pointerCoords.y : targetBounding.bottom,
            },
        };

        const positions = {
            y: {
                top: pointerCoords
                    ? positionRef.y.top - elementBounding.height
                    : positionRef.y.top - elementBounding.height - 10,
                bottom: pointerCoords ? positionRef.y.bottom : positionRef.y.bottom + 10,
            },
            x: {
                left: pointerCoords ? positionRef.x.left : positionRef.x.left - elementBounding.width - 10,
                right: pointerCoords ? positionRef.x.right : positionRef.x.right + 10,
            },
        };

        if (el.classList.contains("hint")) {
            if (pointerCoords && !el.classList.contains("displayed")) {
                switch (axis) {
                    case "y":
                        if (positions.y.top > 10) {
                            setPos("top");
                            updateCoords({
                                left: pointerCoords.x + 10,
                                top: positions.y.top,
                            });
                        } else {
                            setPos("bottom");
                            updateCoords({
                                left: pointerCoords.x + 10,
                                top: positions.y.bottom,
                            });
                        }
                        break;
                    case "x":
                        if (positions.x.left > 10) {
                            setPos("left");
                            updateCoords({
                                top: pointerCoords.y,
                                left: positions.x.left - 10,
                            });
                        } else {
                            setPos("right");
                            updateCoords({
                                top: pointerCoords.y,
                                left: positions.x.right + 10,
                            });
                        }
                        break;
                }
            }

            return;
        }

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
    }, [displayed, text, pointerCoords]);
    console.log("render tooltip", displayed, text, pointerCoords);
    return (
        <div
            ref={element}
            data-axis={axis}
            data-pos={pos}
            className={`pointer-events-none fixed z-9999 text-3.5 py-1.5 px-2 bg-dark text-light rounded-1 tooltip ${
                displayed ? "displayed" : ""
            } ${pointerCoords ? `hint` : ""}`}
            style={{
                top: coords.top + "px",
                left: coords.left + "px",
            }}>
            <p dangerouslySetInnerHTML={{ __html: text }}></p>
        </div>
    );
}
