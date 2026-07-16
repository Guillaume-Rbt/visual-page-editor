import { usePartialStore } from "../../Store";
import { PreviewBlock } from "./PreviewBlock";
import { PreviewBlockWrapper } from "./PreviewBlockWrapper";

export function PreviewBlocks({ initHTML }: { initHTML: Record<string, string> }) {
    const { data } = usePartialStore("data");

    return (
        <>
            {data.map((block, i) => {
                return (
                    <PreviewBlockWrapper key={block._id} id={block._id}>
                        <PreviewBlock
                            key={block._id}
                            id={block._id}
                            data={data[i]}
                            html={initHTML[block._id]}></PreviewBlock>
                    </PreviewBlockWrapper>
                );
            })}
        </>
    );
}
