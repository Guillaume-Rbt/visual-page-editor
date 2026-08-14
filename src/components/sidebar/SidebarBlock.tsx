import { memo, useEffect, useRef, useMemo } from "react";
import { useBlockDefinition, usePartialStore } from "../../Store";
import { FieldsRenderer } from "./FieldsRenderer";
import { ButtonAddComponent } from "../ui/ButtonAddComponent";
import { RoundedButton } from "../ui/RoundedButton";
import ArrowIcon from "../../assets/imgs/arrow.svg?react";
import TrashIcon from "../../assets/imgs/delete.svg?react";
import useBoolean from "../../hooks/useBoolean";
import { Tooltip } from "../ui/Tooltip";
import { translation } from "../../visual-editor";

export const SidebarBlock = memo(function SidebarBlock({
    name,
    id,
    hasInsertBefore,
    onUpdate,
}: {
    hasInsertBefore: boolean;
    name: string;
    id: string;
    onUpdate: (v: any, path: string) => void;
}) {
    const [isCollapsed, _, __, toggle] = useBoolean(false);
    const blockDefinition = useBlockDefinition(name);
    const { removeData, setFocusIndex, focusIndex, getIndexById } =
        usePartialStore(
            "removeData",
            "setFocusIndex",
            "focusIndex",
            "getIndexById",
        );
    const ref = useRef<HTMLDivElement>(null);

    const isFocused = useMemo(
        () => focusIndex === getIndexById(id),
        [focusIndex, getIndexById, id],
    );

    useEffect(() => {
        if (!isFocused || !ref.current) {
            return;
        }

        ref.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, [isFocused]);

    useEffect(() => {
        if (isFocused && isCollapsed) {
            toggle();
        }
    }, [isFocused, isCollapsed, toggle]);

    return (
        <div
            ref={ref}
            className='relative bg-ve-light w-full flex flex-col shadow rounded-.6 gap-4 border-[1px] border-ve-dark/20 p-is-5 p-ie-2 py-2'>
            {hasInsertBefore && (
                <ButtonAddComponent addType='before' blockId={id} />
            )}

            <div
                onClick={() => {
                    setFocusIndex(null);
                    toggle();
                }}
                className='header w-full flex justify-start gap-2 w-full cursor-pointer flex-items-center'>
                <h2 className='font-bold text-5 mr-auto'>
                    {blockDefinition?.label}
                </h2>
                <Tooltip axis='y' text={translation("deleteComponent")}>
                    <RoundedButton
                        onClick={(e) => {
                            e.stopPropagation();
                            removeData(id);
                        }}
                        classes='p-1 delete-btn hover:bg-ve-dark/10 hover:text-ve-danger ml-auto text-5 cursor-pointer opacity-0 [.header:hover_&]:opacity-100'>
                        <TrashIcon />
                    </RoundedButton>
                </Tooltip>
                <RoundedButton
                    classes={`[.header:hover:not(:has(.delete-btn:hover))_&]:bg-ve-dark/10  hover:bg-ve-dark/10 p-.5 text-6 cursor-pointer transition-transform transition-200  ${isCollapsed ? "rotate--90" : "rotate-0"}`}>
                    <ArrowIcon />
                </RoundedButton>
            </div>

            <FieldsRenderer
                isVisible={!isCollapsed}
                onUpdate={onUpdate}
                dataPath={`${id}`}
                id={id}
                fields={blockDefinition!.fields ?? []}
            />

            <ButtonAddComponent blockId={id} />
        </div>
    );
});
