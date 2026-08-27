import { useEffect, useRef, useState } from "react";
import { Select } from "../../ui/Select";

type ColorFormat = "hex" | "hexa" | "rgb" | "rgba" | "hsl" | "hsla";

const FORMAT_LABELS: Record<ColorFormat, string> = {
    hex: "HEX",
    hexa: "HEXA",
    rgb: "RGB",
    rgba: "RGBA",
    hsl: "HSL",
    hsla: "HSLA",
};

type RGB = {
    r: number;
    g: number;
    b: number;
};

type HSV = {
    h: number;
    s: number;
    v: number;
};

type Props = {
    value: string;
    onChange?: (value: string) => void;
};

export function ColorPicker({ value, onChange }: Props) {
    const colorCanvasRef = useRef<HTMLCanvasElement>(null);

    const hueCanvasRef = useRef<HTMLCanvasElement>(null);

    const initializedRef = useRef(false);

    const [hue, setHue] = useState(0);

    const [saturation, setSaturation] = useState(75);

    const [brightness, setBrightness] = useState(68);

    const [alpha, setAlpha] = useState(1);

    const [format, setFormat] = useState<ColorFormat>("hex");

    const [inputValue, setInputValue] = useState("");

    const [invalid, setInvalid] = useState(false);

    const [draggingColor, setDraggingColor] = useState(false);

    const [draggingHue, setDraggingHue] = useState(false);

    function hsvToRgb(h: number, s: number, v: number): RGB {
        s /= 100;
        v /= 100;

        const c = v * s;

        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));

        const m = v - c;

        let r = 0;
        let g = 0;
        let b = 0;

        if (h < 60) {
            r = c;
            g = x;
        } else if (h < 120) {
            r = x;
            g = c;
        } else if (h < 180) {
            g = c;
            b = x;
        } else if (h < 240) {
            g = x;
            b = c;
        } else if (h < 300) {
            r = x;
            b = c;
        } else {
            r = c;
            b = x;
        }

        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255),
        };
    }

    function rgbToHsv(r: number, g: number, b: number): HSV {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);

        const min = Math.min(r, g, b);

        const delta = max - min;

        let h = 0;

        if (delta !== 0) {
            switch (max) {
                case r:
                    h = 60 * (((g - b) / delta) % 6);
                    break;

                case g:
                    h = 60 * ((b - r) / delta + 2);
                    break;

                case b:
                    h = 60 * ((r - g) / delta + 4);
                    break;
            }
        }

        if (h < 0) {
            h += 360;
        }

        const s = max === 0 ? 0 : delta / max;

        return {
            h,
            s: s * 100,
            v: max * 100,
        };
    }

    function componentToHex(value: number) {
        return Math.round(value).toString(16).padStart(2, "0").toUpperCase();
    }

    function rgbToHex(r: number, g: number, b: number) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function rgbaToHex(r: number, g: number, b: number, a: number) {
        return rgbToHex(r, g, b) + componentToHex(a * 255);
    }

    function rgbToHsl(r: number, g: number, b: number) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);

        const min = Math.min(r, g, b);

        const delta = max - min;

        let h = 0;
        let s = 0;

        const l = (max + min) / 2;

        if (delta !== 0) {
            s = delta / (1 - Math.abs(2 * l - 1));

            switch (max) {
                case r:
                    h = 60 * (((g - b) / delta) % 6);
                    break;

                case g:
                    h = 60 * ((b - r) / delta + 2);
                    break;

                case b:
                    h = 60 * ((r - g) / delta + 4);
                    break;
            }
        }

        if (h < 0) {
            h += 360;
        }

        return {
            h,
            s: s * 100,
            l: l * 100,
        };
    }

    function getFormattedColor(currentFormat = format) {
        const { r, g, b } = hsvToRgb(hue, saturation, brightness);

        const hsl = rgbToHsl(r, g, b);

        switch (currentFormat) {
            case "hex":
                return rgbToHex(r, g, b);

            case "hexa":
                return rgbaToHex(r, g, b, alpha);

            case "rgb":
                return `rgb(${r}, ${g}, ${b})`;

            case "rgba":
                return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(2))})`;

            case "hsl":
                return (
                    `hsl(` +
                    `${Math.round(hsl.h)}, ` +
                    `${Math.round(hsl.s)}%, ` +
                    `${Math.round(hsl.l)}%` +
                    `)`
                );

            case "hsla":
                return (
                    `hsla(` +
                    `${Math.round(hsl.h)}, ` +
                    `${Math.round(hsl.s)}%, ` +
                    `${Math.round(hsl.l)}%, ` +
                    `${Number(alpha.toFixed(2))}` +
                    `)`
                );
        }
    }

    function drawHue() {
        const canvas = hueCanvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

        gradient.addColorStop(0, "rgb(255, 0, 0)");

        gradient.addColorStop(1 / 6, "rgb(255, 255, 0)");

        gradient.addColorStop(2 / 6, "rgb(0, 255, 0)");

        gradient.addColorStop(3 / 6, "rgb(0, 255, 255)");

        gradient.addColorStop(4 / 6, "rgb(0, 0, 255)");

        gradient.addColorStop(5 / 6, "rgb(255, 0, 255)");

        gradient.addColorStop(1, "rgb(255, 0, 0)");

        ctx.fillStyle = gradient;

        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawColorArea() {
        const canvas = colorCanvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const white = ctx.createLinearGradient(0, 0, canvas.width, 0);

        white.addColorStop(0, "rgba(255,255,255,1)");

        white.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = white;

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const black = ctx.createLinearGradient(0, 0, 0, canvas.height);

        black.addColorStop(0, "rgba(0,0,0,0)");

        black.addColorStop(1, "rgba(0,0,0,1)");

        ctx.fillStyle = black;

        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function selectColor(event: React.PointerEvent<HTMLCanvasElement>) {
        const canvas = colorCanvasRef.current;

        if (!canvas) {
            return;
        }

        const rect = canvas.getBoundingClientRect();

        let x = event.clientX - rect.left;

        let y = event.clientY - rect.top;

        x = Math.max(0, Math.min(rect.width, x));

        y = Math.max(0, Math.min(rect.height, y));

        setSaturation((x / rect.width) * 100);

        setBrightness(100 - (y / rect.height) * 100);
    }

    function selectHue(event: React.PointerEvent<HTMLCanvasElement>) {
        const canvas = hueCanvasRef.current;

        if (!canvas) {
            return;
        }

        const rect = canvas.getBoundingClientRect();

        let x = event.clientX - rect.left;

        x = Math.max(0, Math.min(rect.width, x));

        setHue((x / rect.width) * 360);
    }

    function parseColor(input?: string) {
        const value = input?.trim();

        if (!value) {
            return null;
        }

        const element = document.createElement("div");

        element.style.color = "";

        element.style.color = value;

        if (!element.style.color) {
            return null;
        }

        document.body.appendChild(element);

        const computed = getComputedStyle(element).color;

        element.remove();

        const match = computed.match(
            /rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/,
        );

        if (!match) {
            return null;
        }

        return {
            r: Number(match[1]),
            g: Number(match[2]),
            b: Number(match[3]),
            a: match[4] !== undefined ? Number(match[4]) : 1,
        };
    }

    function applyInputValue() {
        const parsed = parseColor(inputValue);

        if (!parsed) {
            setInvalid(true);

            return;
        }

        setInvalid(false);

        const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);

        setHue(hsv.h);
        setSaturation(hsv.s);
        setBrightness(hsv.v);
        setAlpha(parsed.a);
    }

    useEffect(() => {
        const parsed = parseColor(value);

        if (!parsed) {
            return;
        }

        const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);

        setHue(hsv.h);
        setSaturation(hsv.s);
        setBrightness(hsv.v);
        setAlpha(parsed.a);
    }, [value]);

    useEffect(() => {
        drawHue();
    }, []);

    useEffect(() => {
        drawColorArea();
    }, [hue]);

    // rgb n'a pas de canal alpha : bascule vers rgba dès que l'opacité change
    useEffect(() => {
        if (format === "rgb" && alpha !== 1) {
            setFormat("rgba");
        }
    }, [alpha, format]);

    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;

            setInputValue(getFormattedColor());

            return;
        }

        const color = getFormattedColor();

        setInputValue(color);

        onChange?.(color);
    }, [hue, saturation, brightness, alpha, format]);

    const colorCursorLeft = `${saturation}%`;

    const colorCursorTop = `${100 - brightness}%`;

    const hueCursorLeft = `${(hue / 360) * 100}%`;

    return (
        <div
            className='
                w-[10rem]
                bg-white
            '>
            {/* Saturation / luminosité */}

            <div
                className='
                    relative
                    h-[10rem]
                    w-full
                    overflow-hidden
                '>
                <canvas
                    ref={colorCanvasRef}
                    width={258}
                    height={168}
                    className='
                        h-full
                        w-full
                        cursor-crosshair
                    '
                    onPointerDown={(event) => {
                        setDraggingColor(true);

                        event.currentTarget.setPointerCapture(event.pointerId);

                        selectColor(event);
                    }}
                    onPointerMove={(event) => {
                        if (draggingColor) {
                            selectColor(event);
                        }
                    }}
                    onPointerUp={() => {
                        setDraggingColor(false);
                    }}
                    onPointerCancel={() => {
                        setDraggingColor(false);
                    }}
                />

                <div
                    className='
                        pointer-events-none
                        absolute
                        size-5
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        border-4
                        border-white
                        shadow
                        ring-1
                        ring-black/30
                    '
                    style={{
                        left: colorCursorLeft,

                        top: colorCursorTop,
                    }}
                />
            </div>

            {/* Teinte */}

            <div
                className='
                    relative
                    mt-4
                    h-4
                    w-full
                '>
                <canvas
                    ref={hueCanvasRef}
                    width={258}
                    height={14}
                    className='
                        h-3.5
                        w-full
                        cursor-pointer
                        rounded-full
                    '
                    onPointerDown={(event) => {
                        setDraggingHue(true);

                        event.currentTarget.setPointerCapture(event.pointerId);

                        selectHue(event);
                    }}
                    onPointerMove={(event) => {
                        if (draggingHue) {
                            selectHue(event);
                        }
                    }}
                    onPointerUp={() => {
                        setDraggingHue(false);
                    }}
                    onPointerCancel={() => {
                        setDraggingHue(false);
                    }}
                />

                <div
                    className='
                        pointer-events-none
                        absolute
                        top-[7px]
                        size-[18px]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        border-[3px]
                        border-white
                        shadow
                        ring-1
                        ring-black/30
                    '
                    style={{
                        left: hueCursorLeft,
                    }}
                />
            </div>

            {/* Opacité */}

            <div
                className='
                    mt-5
                '>
                <div
                    className='
                        mb-2
                        flex
                        items-center
                        justify-between
                        text-sm
                        text-neutral-600
                    '>
                    <span>Opacité</span>

                    <span>{Math.round(alpha * 100)}%</span>
                </div>

                <input
                    type='range'
                    min={0}
                    max={1}
                    step={0.01}
                    value={alpha}
                    onChange={(event) => {
                        setAlpha(Number(event.target.value));
                    }}
                    className='
                        w-full
                        cursor-pointer
                        accent-neutral-900
                    '
                />
            </div>

            {/* Valeur */}

            <div
                className='
                    mt-4
                    flex
                    flex-col
                    -center
                    gap-2
                    rounded-xl
                    border
                    border-neutral-200
                    px-2
                    py-2
                '>
                {/* Format */}

                <Select
                    value={format}
                    onChange={(nextValue) => {
                        setFormat(nextValue as ColorFormat);
                    }}
                    options={(Object.keys(FORMAT_LABELS) as ColorFormat[])
                        .filter((f) => f !== "rgb" || alpha === 1)
                        .map((f) => ({
                            value: f,
                            render: () => FORMAT_LABELS[f],
                        }))}
                />

                {/* Input */}

                <input
                    value={inputValue}
                    spellCheck={false}
                    onChange={(event) => {
                        setInputValue(event.target.value);

                        setInvalid(false);
                    }}
                    onBlur={applyInputValue}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.currentTarget.blur();
                        }
                    }}
                    className={`
                        min-w-0
                        flex-1
                        border-0
                        bg-transparent
                        text-3.5
                        outline-none

                        ${invalid ? "text-red-600" : "text-neutral-900"}
                    `}
                />
            </div>

            {invalid && (
                <p
                    className='
                        mt-1
                        text-xs
                        text-red-600
                    '>
                    Couleur invalide
                </p>
            )}
        </div>
    );
}
