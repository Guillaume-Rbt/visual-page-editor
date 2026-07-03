import { usePartialStore } from "../../Store";
import { ComponentDefinition, ComponentValue, FieldComponent } from "../../types";
import { setDeepValue } from "../../utils/utils";
import { defineField, translation } from "../../visual-editor";
import { v4 as uuid } from "uuid";
import { Field } from "./Field";
import ArrowIcon from "../../assets/imgs/arrow.svg?react";
import TrashIcon from "../../assets/imgs/delete.svg?react";
import { FieldsRenderer } from "../sidebar/FieldsRenderer";
import useBoolean from "../../hooks/useBoolean";
import { RoundedButton } from "../ui/RoundedButton";
import { BlockItem } from "../blocksLibrary/BlockItem";
import { useCallback, useEffect, useMemo } from "react";
import Select from "../ui/Select";

type FieldArgs = {
    label: string;
    description?: string;
};

type ComponentProps = {
    onChange: (value: any) => void;
    value: ComponentValue;
    label: string;
};

function SlotComponent({ value, onChange, label }: ComponentProps) {
    const { blocs } = usePartialStore("blocs");

    const options = useMemo(
        () =>
            blocs
                .filter((b) => b.usableInSlot)
                .map((b) => ({
                    value: b,
                    label: b.label,
                    render: () => <BlockItem name={b.name} label={b.label} handleClick={() => {}} />,
                })),
        [blocs],
    );

    const selectedBloc = blocs.find((b) => b.name === value?._name) ?? null;

    const removeBloc = () => {
        onChange(null);
    };

    const setBloc = (bloc: ComponentDefinition) => {
        const newBlocData = { _id: uuid(), _name: bloc.name, data: {} } as ComponentValue;
        bloc.fields.forEach((field) => {
            newBlocData["data"][field.name!] = field.options.defaultValue;
        });
        onChange(newBlocData);
    };

    const onUpdate = (v: any, path: string) => {
        const keys = path.split(".");

        keys.shift();

        onChange(setDeepValue(value, keys, v));
    };
    return (
        <div className='slot relative border border-dark/20 rounded p-2 bg-white'>
            {selectedBloc && (
                <SlotBloc
                    id={value._id}
                    value={value}
                    bloc={selectedBloc}
                    removeBloc={removeBloc}
                    onUpdate={onUpdate}
                    label={label}
                />
            )}
            {!selectedBloc && (
                <Select
                    placeholder={translation("selectSlotComponent")}
                    layout={{ cols: 3 }}
                    hoverable={false}
                    options={options}
                    onChange={setBloc}
                />
            )}
        </div>
    );
}

function SlotBloc({
    bloc,
    value,
    onUpdate,
    removeBloc,
    id,
    label,
}: {
    bloc: ComponentDefinition;
    value: ComponentValue;
    onUpdate: (value: any, path: string) => void;
    id: string;
    removeBloc: () => void;
    label: string;
}) {
    const [isCollapsed, _, __, toggleCollapsed] = useBoolean(false);

    return (
        <div className='flex flex-col '>
            <div className='w-full flex items-center header cursor-pointer gap-2' onClick={toggleCollapsed}>
                <h3>
                    <span className='font-600'>{label}</span> (composant : {bloc.label})
                </h3>
                <RoundedButton
                    onClick={(e) => {
                        e.stopPropagation();
                        removeBloc();
                    }}
                    classes='p-1 delete-btn hover:bg-dark/10 hover:text-danger ml-auto text-5 cursor-pointer opacity-0 [.header:hover_&]:opacity-100'>
                    <TrashIcon />
                </RoundedButton>
                <RoundedButton
                    classes={`[.header:hover:not(:has(.delete-btn:hover))_&]:bg-dark/10  hover:bg-dark/10 p-.5 text-6 cursor-pointer transition-transform transition-200  ${isCollapsed ? "rotate--90" : "rotate-0"}`}>
                    <ArrowIcon />
                </RoundedButton>
            </div>
            {!isCollapsed && (
                <FieldsRenderer
                    id={`${id}`}
                    fields={bloc.fields}
                    data={value.data}
                    onUpdate={onUpdate}
                    dataPath={id}></FieldsRenderer>
            )}
        </div>
    );
}

const Component: FieldComponent<FieldArgs, ComponentValue> = ({ value, onChange, options }) => {
    return (
        <Field label={options.label} description={options.description}>
            <SlotComponent value={value} onChange={onChange} label={options.label} />
        </Field>
    );
};

export const Slot = defineField<FieldArgs, ComponentValue>({
    defaultOptions: {},
    render: Component,
});
