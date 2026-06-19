import { memo } from "react";
import { useBlocDefinition, usePartialStore } from "../../Store";
import { FieldsRenderer } from "./FieldsRenderer";
import { ButtonAddComponent } from "../ui/ButtonAddComponent";
import { RoundedButton } from "../ui/RoundedButton";
import ArrowIcon from "../../assets/imgs/arrow.svg?react";
import TrashIcon from "../../assets/imgs/delete.svg?react";
import useBoolean from "../../hooks/useBoolean";
import { Tooltip } from "../ui/Tooltip";

export const SidebarBloc = memo(function SidebarBloc({
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
    const blocDefinition = useBlocDefinition(name);
    const { removeData } = usePartialStore("removeData");

    return (
        <div className='relative bg-white w-full flex flex-col shadow rounded-.6 gap-4 border-[1px] border-dark/20 p-is-5 p-ie-2 py-2'>
            {hasInsertBefore && <ButtonAddComponent addType='before' blocId={id} />}

            <div
                onClick={toggle}
                className='header w-full flex justify-start gap-2 w-full cursor-pointer flex-items-center'>
                <h2 className='font-bold text-5 mr-auto'>{blocDefinition?.label}</h2>
                <Tooltip axis='y' text='Supprimer le bloc'>
                    <RoundedButton
                        onClick={(e) => {
                            e.stopPropagation();
                            removeData(id);
                        }}
                        classes='p-1 delete-btn hover:bg-dark/10 hover:text-danger ml-auto text-5 cursor-pointer opacity-0 [.header:hover_&]:opacity-100'>
                        <TrashIcon />
                    </RoundedButton>
                </Tooltip>
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
