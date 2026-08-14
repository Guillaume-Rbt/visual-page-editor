import { Layout } from "./components/Layout";

export function VisualEditor({ visible = true }: { visible?: boolean }) {
    return (
        <div
            className={`h-full w-full fixed top-0 left-0 z-999 ${visible ? "" : "hidden"}`}>
            <Layout visible={visible}></Layout>
        </div>
    );
}
