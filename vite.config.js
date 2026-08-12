import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [UnoCSS(), svgr()],
    server: {
        port: 5173,
        strictPort: true,
        cors: true,
        proxy: {
            "/preview": "http://localhost:8000/",
        },
    },
    build: {
        copyPublicDir: false,
        lib: {
            entry: "./src/visual-editor.tsx",
            formats: ["es"],
            fileName: () => "visual-editor.js",
        },
    },
});
