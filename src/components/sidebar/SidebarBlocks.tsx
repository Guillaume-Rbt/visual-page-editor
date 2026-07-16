import { usePartialStore } from "../../Store";
import { SidebarBlock } from "./SidebarBlock";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Sortable } from "../Sortable";
import { translation } from "../../visual-editor";

export function SidebarBlocks() {
    const {
        data,
        moveBlock: moveBlock,
        updateData,
        setInsertIndex,
    } = usePartialStore("data", "moveBlock", "updateData", "setInsertIndex");

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const fromIndex = data.findIndex((block) => block._id === active.id);
        const toIndex = data.findIndex((block) => block._id === over.id);

        moveBlock(fromIndex, toIndex);
    };

    return (
        <>
            {data.length === 0 && (
                <button
                    onClick={() => {
                        setInsertIndex(0);
                    }}
                    className='btn btn-primary mt-2'>
                    {translation("addComponent")}
                </button>
            )}
            <DndContext
                modifiers={[restrictToVerticalAxis]}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <div className='flex w-full h-full flex-col px-2 py-2 gap-1 isolate overflow-auto'>
                    <SortableContext items={data.map((block) => block._id)} strategy={verticalListSortingStrategy}>
                        {data.map((block, k) => {
                            return (
                                <Sortable key={block._id} id={block._id}>
                                    <SidebarBlock
                                        hasInsertBefore={k === 0}
                                        id={block._id}
                                        name={block._name}
                                        onUpdate={updateData}></SidebarBlock>
                                </Sortable>
                            );
                        })}
                    </SortableContext>
                </div>
            </DndContext>
        </>
    );
}
