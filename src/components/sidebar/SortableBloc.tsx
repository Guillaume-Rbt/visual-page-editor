import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

export function SortableBloc({
    id,
    children,
}: {
    id: string;
    children: (props: {
        dragHandleRef: (el: HTMLElement | null) => void;
        listeners: any;
        attributes: any;
        isDragging: Boolean
    }) => React.ReactNode;
}) {
    const { attributes, setActivatorNodeRef, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.7 : 1,
                cursor: isDragging ? "grabbing" : "auto",
                zIndex: isDragging ? 999 : "auto",
            }}>
            {children({
                dragHandleRef: setActivatorNodeRef,
                listeners,
                attributes,
                isDragging
            })}
        </div>
    );
}
