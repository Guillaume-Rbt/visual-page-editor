import { FieldComponent, FieldDefinition } from "../../types";
import { defineField } from "../../visual-editor";
import { Field } from "./Field";
import { FieldsRenderer } from "../sidebar/FieldsRenderer";
import TrashIcon from "../../assets/imgs/delete.svg?react";
import { deleteFromArray, setDeepValue } from "../../utils/utils";
import { RoundedButton } from "../ui/roundedButton";
import ArrowIcon from "../../assets/imgs/arrow.svg?react";
import { v4 as uuid } from "uuid";
import useBoolean from "../../hooks/useBoolean";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Sortable } from "../Sortable";
import { Ref, useEffect } from "react";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DndContext, DragEndEvent, DraggableAttributes } from "@dnd-kit/core";
import DraggableIcon from "../../assets/imgs/draggable.svg?react";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Tooltip } from "../ui/Tooltip";

type FieldArgs = {
    label: string;
    fields: FieldDefinition<any, any>[];
    description?: string;
    defaultValue?: RepeaterItemValue[];
    itemLabel?: string;
    min?: number;
    max?: number;
    addButtonLabel?: string;
};

type ComponentProps = {
    onChange: (value: RepeaterItemValue[]) => void;
    value: { [key: string]: any; _id: string }[];
    fields: FieldDefinition<any, any>[];
    itemLabel: string;
    min: number;
    max: number;
    addButtonLabel: string;
};

type RepeaterItemValue = { [key: string]: any; _id: string };

function RepeaterComponent({
    onChange,
    value,
    fields,
    itemLabel,
    addButtonLabel,
    min,
    max,
}: ComponentProps & { fields: FieldDefinition<any, any>[] }) {
    const insertData = () => {
        const newBlocData = { _id: uuid() } as RepeaterItemValue;
        fields.forEach((field) => {
            newBlocData[field.name] = field.options.defaultValue;
        });

        onChange([...value, newBlocData]);
    };
    const canDelete = value.length > min;
    const deleteData = (id: string) => {
        if (!canDelete) return;

        const index = value.findIndex((v) => v._id == id);

        const newValue = deleteFromArray(value, index);
        onChange(newValue);
    };

    const onUpdate = (v: any, path: string) => {
        onChange(setDeepValue(value, path.split("."), v));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const fromIndex = value.findIndex((bloc) => bloc._id === active.id);
        const toIndex = value.findIndex((bloc) => bloc._id === over.id);

        onChange(arrayMove(value, fromIndex, toIndex));
    };

    useEffect(() => {
        if (value.length >= min) return;

        const missing = min - value.length;

        const newItems = Array.from({ length: missing }, () => {
            const newBlocData = { _id: uuid() } as RepeaterItemValue;

            fields.forEach((field) => {
                newBlocData[field.name] = field.options.defaultValue;
            });

            return newBlocData;
        });

        onChange([...value, ...newItems]);
    }, [value.length, min]);

    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
            <div className='flex flex-col'>
                <SortableContext items={value.map((bloc) => bloc._id)} strategy={verticalListSortingStrategy}>
                    {value.map((item, index) => {
                        const label =
                            itemLabel.indexOf("{{id}}") == -1
                                ? (item[itemLabel] ?? `#${index + 1}`) || `#${index + 1}`
                                : itemLabel.replace("{{id}}", `${index + 1}`);

                        return (
                            <Sortable key={item._id} id={item._id}>
                                {({ dragHandleRef, listeners, attributes, isDragging }) => (
                                    <Item
                                        key={item._id!}
                                        onUpdate={onUpdate}
                                        data={item}
                                        path={`${index}`}
                                        fields={fields}
                                        label={label}
                                        onDelete={deleteData}
                                        id={item._id}
                                        isDragging={isDragging}
                                        dragHandleRef={dragHandleRef}
                                        dragListeners={listeners}
                                        dragAttributes={attributes}
                                        canDelete={canDelete}
                                        min={min}
                                    />
                                )}
                            </Sortable>
                        );
                    })}
                </SortableContext>

                <div className='w-full rounded-2 flex justify-end bg-dark/10'>
                    <button
                        className={`btn btn-outline-primary w-max ${value.length >= max ? "pointer-events-none opacity-40" : ""}`}
                        onClick={insertData}>
                        {addButtonLabel}
                    </button>
                </div>
            </div>
        </DndContext>
    );
}

function Item({
    onUpdate,
    data,
    path,
    fields,
    label,
    onDelete,
    id,
    dragHandleRef,
    dragListeners,
    dragAttributes,
    isDragging,
    canDelete,
    min,
}: {
    onUpdate: (value: any, path: string) => void;
    data: Record<string, unknown>;
    path: string;
    fields: FieldDefinition<any, any>[];
    label: string;
    onDelete: (id: string) => void;
    id: string;
    dragHandleRef: Ref<HTMLDivElement>;
    dragListeners: SyntheticListenerMap;
    dragAttributes: DraggableAttributes;
    isDragging: Boolean;
    canDelete: boolean;
    min: number;
}) {
    const [isCollapsed, _, __, toggle] = useBoolean(false);

    return (
        <div className='flex flex-col w-full rounded px-2 p-bs-6 p-be-2 mb-2 border-[1px] border-dark/20 relative'>
            <div
                ref={dragHandleRef}
                className={`absolute flex w-full top-0 left-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                {...dragListeners}
                {...dragAttributes}>
                <DraggableIcon className='text-dark/30 text-6 rotate-90 mx-auto' />
            </div>
            <div onClick={toggle} className='flex items-center gap-2 mb-3 cursor-pointer header'>
                <p className='font-700 flex-grow-1 overflow-hidden'>{label}</p>
                <Tooltip
                    text={`${canDelete ? "Supprimer" : `Impossible de supprimer :<br>${min} élément${min < 2 ? "" : "s"} minimum requi${min < 2 ? "" : "s"}.`}`}>
                    <RoundedButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(id);
                        }}
                        classes={`opacity-0 [.header:hover_&]:opacity-100 delete-btn p-1 ml-auto text-5 ${canDelete ? "cursor-pointer  hover:bg-dark/10 hover:text-danger" : "cursor-not-allowed"} `}>
                        <TrashIcon />
                    </RoundedButton>
                </Tooltip>

                <RoundedButton
                    classes={`[.header:hover:not(:has(.delete-btn:hover))_&]:bg-dark/10 hover:bg-dark/10 p-.5 text-6 cursor-pointer transition-transform transition-200  ${isCollapsed ? "rotate--90" : "rotate-0"}`}>
                    <ArrowIcon />
                </RoundedButton>
            </div>
            <FieldsRenderer isVisible={!isCollapsed} onUpdate={onUpdate} fields={fields} data={data} dataPath={path} />
        </div>
    );
}

const Component: FieldComponent<FieldArgs, { [key: string]: any; _id: string }[]> = ({ value, onChange, options }) => {
    return (
        <Field label={options.label} description={options.description}>
            <RepeaterComponent
                value={value}
                itemLabel={options.itemLabel!}
                onChange={onChange}
                fields={options.fields}
                min={options.min!}
                max={options.max!}
                addButtonLabel={options.addButtonLabel!}
            />
        </Field>
    );
};

export const Repeater = defineField<FieldArgs, RepeaterItemValue[]>({
    defaultOptions: {
        defaultValue: [] as RepeaterItemValue[],
        itemLabel: "",
        min: 0,
        max: Infinity,
        addButtonLabel: "Ajouter",
    },
    render: Component,
});
