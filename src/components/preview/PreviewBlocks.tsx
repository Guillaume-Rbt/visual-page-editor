import { usePartialStore } from "../../Store";
import { Sortable } from "../Sortable";
import { PreviewBlock } from "./PreviewBlock";
import { PreviewBlockWrapper } from "./PreviewBlockWrapper";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
export function PreviewBlocks({ initHTML }: { initHTML: Record<string, string> }) {
    const { data } = usePartialStore("data");

    return (
        <SortableContext items={data.map((block) => block._id)} strategy={verticalListSortingStrategy}>
            {data.map((block, i) => {
                return (
                    <Sortable id={block._id} key={block._id} interactable={false} animateReorder>
                        <PreviewBlockWrapper id={block._id} name={block._name}>
                            <PreviewBlock id={block._id} data={data[i]} html={initHTML[block._id]}></PreviewBlock>
                        </PreviewBlockWrapper>
                    </Sortable>
                );
            })}
        </SortableContext>
    );
}
