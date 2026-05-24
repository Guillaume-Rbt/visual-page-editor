import { memo } from "react";
import {  useBlocDefinition } from "../../Store";
import { FieldsRenderer } from "./FieldsRenderer";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { Ref } from "react";
import DraggableIcon from "../../assets/imgs/draggable.svg?react";
import { ButtonAddComponent } from "../ui/ButtonAddComponent";

export const SidebarBloc = memo(function SidebarBloc({
    name,
    id,
    dragHandleRef,
    dragListeners,
    dragAttributes,
    hasInsertBefore,
    isDragging
}: {
    hasInsertBefore: boolean;
    name: string;
    id: string;
    dragHandleRef: Ref<HTMLDivElement>;
    dragListeners: SyntheticListenerMap;
    dragAttributes: DraggableAttributes;
    isDragging: Boolean
}) {
    const blocDefinition = useBlocDefinition(name);
   console.log("from siadebar", id)
    return (
        <div className='relative bg-white w-full flex flex-col shadow rounded-.6 gap-4 border-[1px] border-dark/20 px-4 py-4'>
            {hasInsertBefore && <ButtonAddComponent addType='before' blocId={id} />}
            <div
                ref={dragHandleRef}
                className={`absolute flex w-full top-0 left-0 ${isDragging ? "cursor-grabbig" : "cursor-grab"}`}
                {...dragListeners}
                {...dragAttributes}>
                <DraggableIcon className='text-dark/30 text-6 rotate-90 mx-auto' />
            </div>
            <h2 className='font-bold text-5'>{blocDefinition?.label}</h2>

            <div className='flex flex-col gap-2'>
                <FieldsRenderer dataPath={`${id}`} id={id} fields={blocDefinition!.fields ?? []}  />
            </div>
            <ButtonAddComponent blocId={id} />
        </div>
    );
});
