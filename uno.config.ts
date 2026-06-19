import { defineConfig, presetWind4 } from "unocss";

export default defineConfig({
    presets: [presetWind4()],

    content: {
        filesystem: ["./src/**", "./index.html"],
    },

    outputToCssLayers: {
        cssLayerName: (layer) => {
            if (layer == "default") {
                return "ve-editor";
            }
            return layer;
        },
        allLayers: true,
    },

    layers: {
        reset: -1,
        base: 0,
        properties: 1,
        theme: 2,
        preflights: 3,
        shortcuts: 4,
        default: 5,
        "ve-editor": 6,
        custom: 7,
    },
    shortcuts: [
        ["bordered-input", "border-1 border-dark/20 border-solid"],
        ["btn", "cursor-pointer rounded-2 px-5 py-3 font-600"],
        ["disabled", "pointer-events-none opacity-40"],
        ["btn-rounded", "rounded-full px-1 py-1"],
        [
            /^btn-(.+)$/,
            ([, color], { theme }) => {
                const themeColor = theme.colors?.[color];

                if (!themeColor || typeof themeColor !== "string") {
                    return "";
                }
                return `
                text-white
                bg-[${themeColor}]
                hover:bg-[color-mix(in_srgb,${themeColor}_85%,#000)]
                transition-background
                duration-300
            `;
            },
        ],
        [
            /^btn-outline-(.+)$/,
            ([, color], { theme }) => {
                const themeColor = theme.colors?.[color];

                if (!themeColor || typeof themeColor !== "string") {
                    return "";
                }
                return `
                border-2
                border-${themeColor}
                border-solid
                text-${themeColor}
                hover:bg-[${themeColor}]
                hover:text-${theme.colors?.light}
                bg-${theme.colors?.["background-light"]}
                transition-background
                duration-300
            `;
            },
        ],
    ],

    rules: [
        [
            "shadow",
            {
                "box-shadow": "0 1px 2px color-mix(in srgb, var(--colors-dark) 40%, transparent)",
            },
        ],
        [
            "transition-discrete",
            {
                "transition-behavior": "allow-discrete",
            },
        ],
    ],

    theme: {
        colors: {
            primary: "#007bff",
            secondary: "#6c757d",
            success: "#28a745",
            danger: "#dc3545",
            warning: "#ffc107",
            info: "#17a2b8",
            light: "#ffffff",
            dark: "#343a40",
            "background-light": "#fbfbfe",
        },
    },
});
