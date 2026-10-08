# Visual Page Editor

A TypeScript library for embedding a visual page editor into a web application.
The editor is exposed as a Web Component, editable components are described in
JavaScript or TypeScript, and their HTML previews are produced by a server
endpoint controlled by the host application.

This repository contains the library, a Vite development demo, and a
Fastify/Edge demonstration server.

## Features

- Searchable block library organized into categories
- Block editing, insertion, deletion, and drag-and-drop reordering
- Responsive previews using configurable device sizes
- JSON output stored in a hidden form field
- Text, rich HTML, number, color, file, select, radio, range, checkbox,
  repeater, and slot fields
- Layout groups using `Group`, `Row`, `Column`, and `Tabs`
- Synchronous, asynchronous, data-derived, or `ref`-linked field options
- Custom fields created with `defineField`
- Translatable interface with styles scoped away from the host page

## Installation

```bash
npm install visual-page-editor
```

Import the module and its stylesheet:

```ts
import { VisualEditor, Text } from "visual-page-editor";
import "visual-page-editor/style.css";
```

## Quick start

Register your blocks before defining the Custom Element:

```ts
import { Text, VisualEditor } from "visual-page-editor";
import "visual-page-editor/style.css";

const visualEditor = new VisualEditor();

visualEditor.registerBlock({
    name: "heading",
    label: "Heading",
    category: "Content",
    usableInSlot: true,
    fields: [
        Text("title", {
            label: "Text",
            defaultValue: "Hello!",
        }),
    ],
});

visualEditor.defineElement("visual-editor");
```

Place the element inside a form. The editor's save button submits that form,
while the resulting JSON is written to a hidden `textarea` using the name
supplied through the `name` attribute.

```html
<form method="post">
    <visual-editor
        name="content"
        shown="true"
        value="[]"
        urlPreview="/preview"
        iconsUrl="/icons/{{name}}.svg">
    </visual-editor>
</form>
```

The preview URL receives either a single `{ _name, _id, data }` block or the
complete block array as a JSON POST request and must return HTML. See
`server/server.ts` for a Fastify and Edge implementation.

## Documentation

The complete documentation is available in [`doc/index.html`](doc/index.html).
It is a standalone static website that can be opened directly or served by any
HTTP server.

It covers:

- Web Component and preview endpoint configuration
- Every option provided by every exported field
- Blocks, JSON data, and dynamic options
- Creating a custom field with `defineField`
- Customizing translations from the exported `FR` dictionary

## Development

Node.js and npm are required.

```bash
npm install
npm run server
npm run dev
```

The Fastify server listens on `http://localhost:8000`. Vite serves the
development demo on `http://localhost:5173` and proxies `/preview`, `/api`, and
`/files` to the demonstration server.

The demo is intentionally not built as a separate application. Vite transforms
[`demo/main.tsx`](demo/main.tsx) on demand when `npm run dev` is running.

Available commands:

| Command          | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| `npm run dev`    | Run the Vite development demo.                                  |
| `npm run server` | Run the demonstration renderer and file API.                    |
| `npm run build`  | Build the library and emit its TypeScript declarations.         |
| `npm test`       | Current placeholder; no automated test suite is configured yet. |

## Project structure

```text
demo/                       Demo block configuration
doc/                        Standalone documentation website
public/                     Icons and files served by the demo
server/
  server.ts                 Fastify server and preview contract
  views/                    Edge page and component templates
src/
  components/fields/        Fields provided by the library
  langs/                    Built-in translations
  utils/utils.ts            defineField, ref, and utilities
  visual-editor.tsx         Public API and Web Component
```

The published library output is generated in `dist/`: `visual-editor.js`,
`visual-editor.d.ts`, and `visual-page-editor.css`.

## Contributing

Contributions can be proposed through the GitHub repository. Keep the existing
TypeScript and Prettier conventions and run at least:

```bash
npm run build
```

## License

The package declares the **ISC** license in `package.json`. The repository does
not currently contain a separate license file.
