import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FieldComponent } from "../../types";
import { clamp, defineField, eventPointerToLocalCoordinates } from "../../utils/utils";
import { Field } from "./Field";

type RangeValue = number | { min: number; max: number };
type RangeObject = { min: number; max: number };
type ThumbKey = "single" | "min" | "max";
const THUMB_RADIUS_PX = 10;

type FieldArgs = {
    label: string;
    description?: string;
    min: number;
    max: number;
    step?: number;
    defaultValue?: RangeValue;
};

type RangeComponentProps = {
    min: number;
    max: number;
    step?: number;
    value?: RangeValue;
    defaultValue?: RangeValue;
    onChange: (v: RangeValue) => void;
};

type RangeContextValue = {
    min: number;
    max: number;
    isRange: boolean;
    singleValue: number;
    rangeValue: RangeObject;
    trackRef: React.MutableRefObject<HTMLDivElement | null>;
    setFromTrackPosition: (x: number, width: number, preferredThumb?: ThumbKey) => void;
    valueFromTrackPosition: (x: number, width: number) => number;
    getClosestThumb: (value: number) => ThumbKey;
    startDragging: (thumb: ThumbKey) => void;
    getThumbLeft: (thumb: ThumbKey) => string;
};

const RangeContext = createContext<RangeContextValue | null>(null);

function isRangeValue(value: RangeValue | undefined): value is RangeObject {
    return typeof value === "object" && value !== null && "min" in value && "max" in value;
}

function normalizeStep(step: number | undefined): number {
    return step && step > 0 ? step : 1;
}

function toStep(value: number, min: number, step: number): number {
    const ratio = (value - min) / step;
    return min + Math.round(ratio) * step;
}

function RangeComponent({ min, max, step, value, defaultValue, onChange }: RangeComponentProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [draggingThumb, setDraggingThumb] = useState<ThumbKey | null>(null);
    const stepValue = normalizeStep(step);
    const isRange = isRangeValue(value) || isRangeValue(defaultValue);

    const singleValue = useMemo(() => {
        const raw = typeof value === "number" ? value : typeof defaultValue === "number" ? defaultValue : min;
        return clamp(toStep(raw, min, stepValue), min, max);
    }, [defaultValue, max, min, stepValue, value]);

    const rangeValue = useMemo(() => {
        const fromValue = isRangeValue(value) ? value : undefined;
        const fromDefault = isRangeValue(defaultValue) ? defaultValue : undefined;
        const source = fromValue ?? fromDefault ?? { min, max };

        const nextMin = clamp(toStep(source.min, min, stepValue), min, max);
        const nextMax = clamp(toStep(source.max, min, stepValue), min, max);

        return nextMin <= nextMax ? { min: nextMin, max: nextMax } : { min: nextMax, max: nextMin };
    }, [defaultValue, max, min, stepValue, value]);

    const getClosestThumb = (nextValue: number): ThumbKey => {
        if (!isRange) {
            return "single";
        }

        const toMin = Math.abs(nextValue - rangeValue.min);
        const toMax = Math.abs(nextValue - rangeValue.max);
        return toMin <= toMax ? "min" : "max";
    };

    const updateValue = (nextValue: number, preferredThumb: ThumbKey = "single") => {
        const stepped = clamp(toStep(nextValue, min, stepValue), min, max);

        if (!isRange) {
            onChange(stepped);
            return;
        }

        const thumb = preferredThumb === "single" ? getClosestThumb(stepped) : preferredThumb;

        if (thumb === "min") {
            if (stepped <= rangeValue.max) {
                onChange({ min: stepped, max: rangeValue.max });
            } else {
                onChange({ min: rangeValue.max, max: stepped });
                setDraggingThumb("max");
            }
            return;
        }

        if (thumb === "max") {
            if (stepped >= rangeValue.min) {
                onChange({ min: rangeValue.min, max: stepped });
            } else {
                onChange({ min: stepped, max: rangeValue.min });
                setDraggingThumb("min");
            }
            return;
        }

        onChange({ min: rangeValue.min, max: stepped });
    };

    const valueFromTrackPosition = (x: number, width: number): number => {
        if (width <= 0) {
            return min;
        }

        const ratio = clamp(x / width, 0, 1);
        return min + ratio * (max - min);
    };

    const setFromTrackPosition = (x: number, width: number, preferredThumb: ThumbKey = "single") => {
        updateValue(valueFromTrackPosition(x, width), preferredThumb);
    };

    const startDragging = (thumb: ThumbKey) => {
        setDraggingThumb(thumb);
    };

    useEffect(() => {
        if (!draggingThumb) {
            return;
        }

        const move = (clientX: number) => {
            const track = trackRef.current;
            if (!track) {
                return;
            }

            const rect = track.getBoundingClientRect();
            setFromTrackPosition(clientX - rect.left, rect.width, draggingThumb);
        };

        const onMouseMove = (event: MouseEvent) => {
            move(event.clientX);
        };

        const onTouchMove = (event: TouchEvent) => {
            const touch = event.touches.item(0) ?? event.changedTouches.item(0);
            if (!touch) {
                return;
            }

            move(touch.clientX);
        };

        const stopDragging = () => {
            setDraggingThumb(null);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("mouseup", stopDragging);
        window.addEventListener("touchend", stopDragging);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("mouseup", stopDragging);
            window.removeEventListener("touchend", stopDragging);
        };
    }, [draggingThumb]);

    const getThumbLeft = (thumb: ThumbKey): string => {
        const safeRange = max - min || 1;
        const v = thumb === "single" ? singleValue : thumb === "min" ? rangeValue.min : rangeValue.max;
        const percentage = clamp(((v - min) / safeRange) * 100, 0, 100);
        return `clamp(${THUMB_RADIUS_PX}px, ${percentage}%, calc(100% - ${THUMB_RADIUS_PX}px))`;
    };

    return (
        <RangeContext.Provider
            value={{
                min,
                max,
                isRange,
                singleValue,
                rangeValue,
                trackRef,
                setFromTrackPosition,
                valueFromTrackPosition,
                getClosestThumb,
                startDragging,
                getThumbLeft,
            }}>
            <Track>
                {isRange ? (
                    <>
                        <Thumb thumb='min' />
                        <Thumb thumb='max' />
                    </>
                ) : (
                    <Thumb thumb='single' />
                )}
            </Track>
        </RangeContext.Provider>
    );
}

function Thumb({ thumb }: { thumb: ThumbKey }) {
    const context = useContext(RangeContext);
    if (!context) {
        return null;
    }

    const { getThumbLeft, startDragging } = context;

    const handleMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.stopPropagation();
        startDragging(thumb);
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLSpanElement>) => {
        event.stopPropagation();
        startDragging(thumb);
    };

    return (
        <span
            className='group inline-flex justify-center items-center absolute w-5 h-5 rounded-full bg-primary top--1.5 left-0 -translate-x-1/2 cursor-pointer z-1'
            style={{ left: getThumbLeft(thumb) }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}>
            <span className='group-hover:scale-125 inline-block w-2.5 h-2.5 rounded-full bg-white'></span>
        </span>
    );
}

function Track({ children }: { children: React.ReactNode }) {
    const context = useContext(RangeContext);
    if (!context) {
        return null;
    }

    const {
        min,
        max,
        isRange,
        singleValue,
        rangeValue,
        trackRef,
        valueFromTrackPosition,
        setFromTrackPosition,
        getClosestThumb,
        startDragging,
    } = context;

    const handlePointerDown = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!trackRef.current) {
            return;
        }

        if ("touches" in event) {
            event.preventDefault();
        }

        const { x } = eventPointerToLocalCoordinates(event, trackRef.current);
        const width = trackRef.current.offsetWidth;
        const valueAtPointer = valueFromTrackPosition(x, width);
        const thumb = isRange ? getClosestThumb(valueAtPointer) : "single";

        setFromTrackPosition(x, width, thumb);
        startDragging(thumb);
    };

    const safeRange = max - min || 1;
    const leftValue = isRange ? rangeValue.min : min;
    const rightValue = isRange ? rangeValue.max : singleValue;
    const selectedLeft = ((leftValue - min) / safeRange) * 100;
    const selectedWidth = ((rightValue - leftValue) / safeRange) * 100;

    return (
        <div
            ref={trackRef}
            className='inline-block h-2 rounded-2 relative bordered-input w-full touch-none'
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}>
            <span
                className='absolute top-0 h-full bg-primary/30 rounded-2'
                style={{ left: `${clamp(selectedLeft, 0, 100)}%`, width: `${clamp(selectedWidth, 0, 100)}%` }}
            />
            {children}
        </div>
    );
}

const Component: FieldComponent<FieldArgs, RangeValue> = ({ value, onChange, options }) => {
    return (
        <Field
            label={`${options.label} (${typeof value === "number" ? value : `min : ${value.min}, max : ${value.max}`})`}
            description={options.description}>
            <RangeComponent
                min={options.min}
                max={options.max}
                step={options.step}
                value={value}
                defaultValue={options.defaultValue}
                onChange={onChange}
            />
        </Field>
    );
};

export const Range = defineField<FieldArgs, RangeValue>({
    defaultOptions: { min: 0, max: 100, step: 1 },
    render: Component,
});
