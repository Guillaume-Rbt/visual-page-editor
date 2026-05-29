import { usePartialStore } from "../../Store";
import { SidebarBloc } from "./SidebarBloc";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Sortable } from "../Sortable";

export function SidebarBlocs() {
    const { data, moveBloc, updateData, setInsertIndex } = usePartialStore(
        "data",
        "moveBloc",
        "updateData",
        "setInsertIndex",
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const fromIndex = data.findIndex((bloc) => bloc._id === active.id);
        const toIndex = data.findIndex((bloc) => bloc._id === over.id);

        moveBloc(fromIndex, toIndex);
    };

    return (
        <>
            {data.length === 0 && (
                <button
                    onClick={() => {
                        setInsertIndex(0);
                    }}
                    className='btn btn-primary'>
                    Ajouter un bloc
                </button>
            )}
            <DndContext
                modifiers={[restrictToVerticalAxis]}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <div className='flex w-full h-full flex-col px-2 gap-1 isolate overflow-auto'>
                    <SortableContext items={data.map((bloc) => bloc._id)} strategy={verticalListSortingStrategy}>
                        {data.map((bloc, k) => {
                            return (
                                <Sortable key={bloc._id} id={bloc._id}>
                                    {({ dragHandleRef, listeners, attributes, isDragging }) => (
                                        <SidebarBloc
                                            hasInsertBefore={k === 0}
                                            id={bloc._id}
                                            name={bloc._name}
                                            isDragging={isDragging}
                                            dragHandleRef={dragHandleRef}
                                            dragListeners={listeners}
                                            dragAttributes={attributes}
                                            onUpdate={updateData}></SidebarBloc>
                                    )}
                                </Sortable>
                            );
                        })}
                    </SortableContext>
                </div>
            </DndContext>
        </>
    );
}
