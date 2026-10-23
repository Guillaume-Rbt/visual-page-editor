import { usePartialStore } from "../../Store";
import { SidebarBlock } from "./SidebarBlock";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Sortable } from "../Sortable";
import { translation } from "../../visual-editor";
import { useRef, useState } from "react";

export function SidebarBlocks() {
    const {
        data,
        moveBlock: moveBlock,
        updateData,
        animReorder,
        setAnimReorder,
        editorOptions,
    } = usePartialStore(
        "data",
        "moveBlock",
        "updateData",
        "animReorder",
        "setAnimReorder",
        "editorOptions",
    );


    const handleDragStart = async () => {
        setAnimReorder({ sidebar: false, preview: false });

    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const fromIndex = data.findIndex((block) => block._id === active.id);
        const toIndex = data.findIndex((block) => block._id === over.id);
        setAnimReorder({ sidebar: false, preview: true });
        moveBlock(fromIndex, toIndex);
  
    };

    return (
        <>
            <DndContext
                modifiers={[restrictToVerticalAxis]}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}>
                <div className='flex  w-full h-full flex-col px-2 py-2 gap-1 isolate overflow-auto'>
                    {data.length === 0 && (
                        <p className='mx-auto my-auto'>
                            {translation("noComponents")}
                        </p>
                    )}

                    <SortableContext
                        items={data.map((block) => block._id)}
                        strategy={verticalListSortingStrategy}>
                        {data.map((block, k) => {
                            console.log(animReorder.sidebar);

                            return (
                                <Sortable
                                    animateReorder={
                                        animReorder.sidebar
                                    }
                                    key={block._id}
                                    interactable={editorOptions.reorderable}
                                    id={block._id}>
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
