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
    },
    shortcuts: {
        btn: "cursor-pointer rounded-2 px-5 py-3",
        "btn-primary":
            "bg-primary hover:bg-[color-mix(in_srgb,var(--colors-primary)_80%,#fff)] transition-background duration-300 text-white",
        "btn-rounded": "rounded-full px-1 py-1",
    },
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
