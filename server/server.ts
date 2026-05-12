import Fastify from "fastify";
import { Edge } from "edge.js";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "url";

const app = Fastify({
    logger: true,
});

const edge = Edge.create();
edge.mount(new URL("./views", import.meta.url));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
    prefix: "/",
});

app.post("/preview", async (req, res) => {
    const data = req.body as Record<string, unknown>[] | Record<string, unknown>;

    const html = Array.isArray(data)
        ? await edge.render("home", { data: data })
        : await edge.render(`./components/${data._name}`, { ...data.data! });

    res.type("text/html").send(html);
});

app.listen({ port: 8000 }, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});
