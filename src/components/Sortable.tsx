import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

export function Sortable({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, setActivatorNodeRef, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    return (
        <div
            className='relative'
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.7 : 1,
                cursor: isDragging ? "grabbing" : "auto",
                zIndex: isDragging ? 999 : "auto",
            }}>
            <div
                ref={setActivatorNodeRef}
                className={`absolute flex w-3 left-1 z-999  top-2 bottom-2    bg-[radial-gradient(rgba(0,_0,_0,_0.15),_rgba(0,_0,_0,_0.1)_35%,_rgba(0,_0,_0,_0)_40%,_rgba(0,_0,_0,_0))]
    bg-[length:calc(var(--spacing)_*_1.5)_calc(var(--spacing)_*_1.5)]
    bg-repeat
     top-0 left-0 ${isDragging ? "cursor-grabbig" : "cursor-grab"}`}
                {...listeners}
                {...attributes}></div>
            {children}
        </div>
    );
}
