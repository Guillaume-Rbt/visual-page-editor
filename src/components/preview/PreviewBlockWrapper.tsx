import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { usePartialStore } from "../../Store";
import ChevronIcon from "../../assets/imgs/arrow.svg?react";
import DeleteIcon from "../../assets/imgs/delete.svg?react";

import unoCss from "virtual:uno.css?inline";
import { stopPropagation } from "../../utils/utils";

export function PreviewBlockWrapper({
    children,
    id,
    name,
}: {
    children: ReactNode;
    id: string;
    name: string;
}) {
    const {
        moveBlock,
        removeData,
        getIndexById,
        setFocusIndex,
        focusIndex,
        data,
        setAnimReorder,
        editorOptions,
    } = usePartialStore(
        "moveBlock",
        "removeData",
        "getIndexById",
        "setFocusIndex",
        "focusIndex",
        "data",
        "setAnimReorder",
        "editorOptions",
    );
    const { reorderable } = editorOptions;
    const canDelete = !editorOptions.requiredBlocks.includes(
        data.find((b) => b._id === id)?._name ?? "",
    );

    const hostRef = useRef<HTMLDivElement>(null);

    const [shadowContainer, setShadowContainer] =
        useState<HTMLDivElement | null>(null);

    const handleMove = (direction: "up" | "down") => {
        const currentIndex = getIndexById(id);
        const newIndex =
            direction === "up" ? currentIndex - 1 : currentIndex + 1;

        moveBlock(currentIndex, newIndex, true);
    };

    useLayoutEffect(() => {
        const currentId = getIndexById(id);
        if (currentId !== focusIndex) {
            return;
        }

        const block = hostRef.current?.closest(
            ".sortable",
        ) as HTMLElement | null;
        const doc = hostRef.current?.ownerDocument;
        const scrollingElement = doc?.scrollingElement as HTMLElement | null;

        if (!block || !scrollingElement) {
            return;
        }

        const blockTop =
            block.getBoundingClientRect().top + scrollingElement.scrollTop;
        scrollingElement.scrollTo({
            top: Math.max(0, blockTop - 32),
            behavior: "auto",
        });
    }, [focusIndex, getIndexById, id]);
    const [hovered, setHovered] = useState(false);
    useLayoutEffect(() => {
        const host = hostRef.current;

        if (!host) {
            return;
        }

        const shadowRoot =
            host.shadowRoot ??
            host.attachShadow({
                mode: "open",
            });

        const ownerDocument = host.ownerDocument;

        const unoVariables = ownerDocument.createElement("style");

        unoVariables.textContent = `
    :host,
    *,
    *::before,
    *::after {
        --un-bg-opacity: 100%;
        --un-text-opacity: 100%;
        --un-border-opacity: 100%;
        --un-outline-opacity: 100%;
        --un-shadow-opacity: 100%;
        --un-translate-y: -100%;
        --un-translate-x: 0;
        --spacing: 4px;
  
    }
        :host {
        font-size: 16px;}
`;

        const style = ownerDocument.createElement("style");
        style.textContent = unoCss;

        const container = ownerDocument.createElement("div");
        container.className = "ve-editor-element";

        shadowRoot.replaceChildren(unoVariables, style, container);

        setShadowContainer(container);

        return () => {
            setShadowContainer(null);
            shadowRoot.replaceChildren();
        };
    }, []);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={(e) => {
                e.preventDefault();
                stopPropagation(
                    setFocusIndex,
                    getIndexById(id) == focusIndex ? null : getIndexById(id),
                );
            }}
            style={{ position: "relative" }}>
            <div
                ref={hostRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 100,
                    pointerEvents: "none",
                }}></div>

            {shadowContainer &&
                createPortal(
                    <div
                        className={`absolute inset-0 opacity-0 pointer-events-none hover:opacity-100 border-1 border-ve-primary ${getIndexById(id) === focusIndex || hovered ? "opacity-100" : ""}`}>
                        <div className='flex absolute top-0 left-[-1px] translate-y-[-100%] transition-opacity duration-200'>
                            <p className='bg-ve-primary text-ve-light px-2 py-1 rounded-tl-md rounded-tr-md text-[16px] font-600 mb-0'>
                                {name}
                            </p>
                        </div>

                        <div className='flex absolute top-0 right-1 gap-1 translate-y-[-100%]  pointer-events-auto'>
                            {canDelete && (
                                <button
                                    type='button'
                                    onClick={stopPropagation(removeData, id)}
                                    className='btn btn-ve-danger px-1 py-.7 text-ve-light rounded-b-0'>
                                    <DeleteIcon className='text-[16px]' />
                                </button>
                            )}

                            {reorderable && (
                                <>
                                    <button
                                type='button'
                                disabled={getIndexById(id) === data.length - 1}
                                onClick={stopPropagation(async () => {
                                    await setAnimReorder({
                                        preview: true,
                                        sidebar: true,
                                    });
                                    handleMove("down");
                                })}
                                className={`btn btn-ve-primary px-1 pt-1 pb-1 rounded-b-0 ${getIndexById(id) === data.length - 1 ? "opacity-50 pointer-events-none" : ""}`}>
                                <ChevronIcon className='text-[16px] text-ve-light' />
                            </button>

                            <button
                                type='button'
                                disabled={getIndexById(id) === 0}
                                onClick={stopPropagation(async () => {
                                    await setAnimReorder({
                                        preview: true,
                                        sidebar: true,
                                    });
                                    handleMove("up");
                                })}
                                className={`btn btn-ve-primary px-1 pt-1 pb-1 rounded-b-0 ${getIndexById(id) === 0 ? "opacity-50 pointer-events-none" : ""}`}>
                                <ChevronIcon className='text-[16px] text-ve-light rotate-180' />
                            </button>
                                </>
                            )}
                        </div>
                    </div>,
                    shadowContainer,
                )}
            {children}
        </div>
    );
}
