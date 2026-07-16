import { Layout } from "./components/Layout";

export function VisualEditor({ visible = true }: { visible?: boolean }) {
    return (
        <div className='h-full w-full'>
            <Layout visible={visible}></Layout>
        </div>
    );
}
