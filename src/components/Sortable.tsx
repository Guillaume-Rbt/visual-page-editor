import { CSS } from "@dnd-kit/utilities";
import { defaultAnimateLayoutChanges, useSortable, type AnimateLayoutChanges } from "@dnd-kit/sortable";
import { useLayoutEffect, useRef } from "react";

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
    return defaultAnimateLayoutChanges({
        ...args,
        isSorting: true,
        wasDragging: true,
    });
};

export function Sortable({
    id,
    children,
    interactable = true,
    animateReorder = false,
}: {
    id: string;
    children: React.ReactNode;
    interactable?: boolean;
    animateReorder?: boolean;
}) {
    const { attributes, setActivatorNodeRef, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
        animateLayoutChanges,
        transition: {
            duration: 300,
            easing: "ease",
        },
    });

    const nodeRef = useRef<HTMLDivElement | null>(null);
    const previousRectRef = useRef<DOMRect | null>(null);

    useLayoutEffect(() => {
        if (!animateReorder) {
            return;
        }

        const node = nodeRef.current;
        if (!node) {
            return;
        }

        const currentRect = node.getBoundingClientRect();
        const previousRect = previousRectRef.current;

        if (previousRect && !isDragging && !transform) {
            const deltaX = previousRect.left - currentRect.left;
            const deltaY = previousRect.top - currentRect.top;

            if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
                node.animate(
                    [{ transform: `translate(${deltaX}px, ${deltaY}px)` }, { transform: "translate(0px, 0px)" }],
                    {
                        duration: 260,
                        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    },
                );
            }
        }

        previousRectRef.current = currentRect;
    });

    return (
        <div
            ref={(node) => {
                nodeRef.current = node;
                setNodeRef(node);
            }}
            className='relative'
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.7 : 1,
                cursor: isDragging ? "grabbing" : "auto",
                zIndex: isDragging ? 999 : "auto",
            }}>
            {interactable && (
                <div
                    ref={setActivatorNodeRef}
                    className={`
                        absolute left-0 top-0 bottom-0 z-999 flex w-3
                        bg-[radial-gradient(rgba(0,_0,_0,_0.15),_rgba(0,_0,_0,_0.1)_35%,_rgba(0,_0,_0,_0)_40%,_rgba(0,_0,_0,_0))]
                        bg-[length:calc(var(--spacing)_*_1.5)_calc(var(--spacing)_*_1.5)]
                        bg-repeat
                        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
                    `}
                    {...listeners}
                    {...attributes}
                />
            )}

            {children}
        </div>
    );
}
