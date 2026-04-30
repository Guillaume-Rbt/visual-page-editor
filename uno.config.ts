import { defineConfig, presetWind4 } from "unocss";

export default defineConfig({
  presets: [presetWind4()],

  content: {
    filesystem: ["./**"],
  },

  outputToCssLayers: {
    cssLayerName: (layer) => {
      if (layer == "default") {
        return "ve-editor";
      }
    },
  },

  layers: {
    base: -1,
    reset: 0,
    "ve-editor": 6,
  },

  rules: [
    [
      "shadow",
      {
        "box-shadow":
          "0 1px 2px color-mix(in srgb, var(--colors-dark) 40%, transparent)",
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
    },
  },
});
