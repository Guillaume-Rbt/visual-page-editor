import { memo } from "react";
import { useBlocDefinition, usePartialStore } from "../../Store";
import { FieldsRenderer } from "./FieldsRenderer";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { Ref } from "react";
import DraggableIcon from "../../assets/imgs/draggable.svg?react";
import { ButtonAddComponent } from "../ui/ButtonAddComponent";
import { RoundedButton } from "../ui/roundedButton";
import ArrowIcon from "../../assets/imgs/arrow.svg?react";
import TrashIcon from "../../assets/imgs/delete.svg?react";
import useBoolean from "../../hooks/useBoolean";

export const SidebarBloc = memo(function SidebarBloc({
    name,
    id,
    dragHandleRef,
    dragListeners,
    dragAttributes,
    isDragging,
    hasInsertBefore,
    onUpdate,
}: {
    hasInsertBefore: boolean;
    name: string;
    id: string;
    dragHandleRef: Ref<HTMLDivElement>;
    dragListeners: SyntheticListenerMap;
    dragAttributes: DraggableAttributes;
    isDragging: Boolean;
    onUpdate: (v: any, path: string) => void;
}) {
    const [isCollapsed, _, __, toggle] = useBoolean(false);
    const blocDefinition = useBlocDefinition(name);
    const { removeData } = usePartialStore("removeData");

    return (
        <div className='relative bg-white w-full flex flex-col shadow rounded-.6 gap-4 border-[1px] border-dark/20 px-2 p-bs-7 p-be-2'>
            {hasInsertBefore && <ButtonAddComponent addType='before' blocId={id} />}
            <div
                ref={dragHandleRef}
                className={`absolute flex w-full top-0 left-0 ${isDragging ? "cursor-grabbig" : "cursor-grab"}`}
                {...dragListeners}
                {...dragAttributes}>
                <DraggableIcon className='text-dark/30 text-6 rotate-90 mx-auto' />
            </div>
            <div onClick={toggle} className='header flex justify-start gap-2 w-full cursor-pointer flex-items-center'>
                <h2 className='font-bold text-5'>{blocDefinition?.label}</h2>{" "}
                <RoundedButton
                    onClick={(e) => {
                        e.stopPropagation();
                        removeData(id);
                    }}
                    classes='p-1 delete-btn hover:bg-dark/10 hover:text-danger ml-auto text-5 cursor-pointer opacity-0 [.header:hover_&]:opacity-100'>
                    <TrashIcon />
                </RoundedButton>
                <RoundedButton
                    classes={`[.header:hover:not(:has(.delete-btn:hover))_&]:bg-dark/10  hover:bg-dark/10 p-.5 text-6 cursor-pointer transition-transform transition-200  ${isCollapsed ? "rotate--90" : "rotate-0"}`}>
                    <ArrowIcon />
                </RoundedButton>
            </div>

            <FieldsRenderer
                isVisible={!isCollapsed}
                onUpdate={onUpdate}
                dataPath={`${id}`}
                id={id}
                fields={blocDefinition!.fields ?? []}
            />

            <ButtonAddComponent blocId={id} />
        </div>
    );
});
