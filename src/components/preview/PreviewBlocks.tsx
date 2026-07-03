import { usePartialStore } from "../../Store";
import { PreviewBlock } from "./PreviewBlock";

export function PreviewBlocks({ initHTML }: { initHTML: Record<string, string> }) {
    const { data } = usePartialStore("data");

    return (
        <>
            {data.map((bloc, i) => {
                return <PreviewBlock key={bloc._id} data={data[i]} html={initHTML[bloc._id]}></PreviewBlock>;
            })}
        </>
    );
}
