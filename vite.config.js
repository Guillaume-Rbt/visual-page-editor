import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import svgr from "vite-plugin-svgr";
import postcss from "postcss";
import path from "node:path";
const SCOPE = ".ve-editor-element, .components-root";
const GLOBAL_ONLY_AT_RULES = new Set(["layer", "keyframes", "property", "font-face", "import", "charset", "namespace", "scope"]);

function rewriteRootSelectors(rule) {
    rule.selectors = rule.selectors.map(selector =>
        selector.replace(/(^|[\s,>+~])(:root|:host|html|body)(?![\w-])/g, "$1:scope"),
    );
}

function scopeContainer(container) {
    const scoped = [];

    container.each(node => {
        if (node.type === "comment") return;
        if (node.type === "atrule" && GLOBAL_ONLY_AT_RULES.has(node.name.replace(/^-\w+-/, ""))) {
            if (node.name === "layer" && node.nodes) scopeContainer(node);
            return;
        }
        if (node.type === "rule") rewriteRootSelectors(node);
        scoped.push(node);
    });

    if (!scoped.length) return;

    const scope = postcss.atRule({ name: "scope", params: `(${SCOPE})` });
    scoped[0].before(scope);
    scoped.forEach(node => scope.append(node));
}

const SRC_DIR = path.resolve(import.meta.dirname, 'src').replace(/\\/g, '/') + '/';
const shouldScope = from => from.startsWith(SRC_DIR) || /uno\.css|__uno/.test(from);

const scopeCSS = () => ({
    postcssPlugin: "scope-ve-editor",
    Once(root, { result }) {
        const from = (result.opts.from || '').replace(/\\/g, '/');
        if (shouldScope(from)) scopeContainer(root);
    },
});
scopeCSS.postcss = true;
export default defineConfig({
    plugins: [UnoCSS(), svgr()],
    server: {
        port: 5173,
        strictPort: true,
        cors: true,
        proxy: {
            "/preview": "http://localhost:8000/",
            "/api": "http://localhost:8000/",
            "/files": {
                target: "http://localhost:8000",
            },
        },
    },
    css: {
        postcss: {
            plugins: [scopeCSS()],
        }
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
