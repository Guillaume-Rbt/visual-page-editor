import { defineConfig, presetWind4 } from "unocss";

export default defineConfig({
  presets: [presetWind4()],

  outputToCssLayers: {
    cssLayerName: (layer) => {
      if (layer == "default") return "visual-editor";
    },
  },

  layers: {
    reset: 0,
    "visual-editor": 1,
  },

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

  shortcuts: {},
});
