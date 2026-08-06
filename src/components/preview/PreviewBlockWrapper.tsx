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
    const { moveBlock, removeData, getIndexById, setFocusIndex, focusIndex } =
        usePartialStore(
            "moveBlock",
            "removeData",
            "getIndexById",
            "setFocusIndex",
            "focusIndex",
        );

    const hostRef = useRef<HTMLDivElement>(null);

    const [shadowContainer, setShadowContainer] =
        useState<HTMLDivElement | null>(null);

    const handleMove = (direction: "up" | "down") => {
        const currentIndex = getIndexById(id);

        const newIndex =
            direction === "up" ? currentIndex - 1 : currentIndex + 1;

        moveBlock(currentIndex, newIndex);
    };

    useLayoutEffect(() => {
        const currentId = getIndexById(id);
        if (currentId === focusIndex) {
            const top = hostRef.current?.offsetTop ?? 0;
            const root = hostRef.current!.closest("html")!;
            root.scrollTop = top;
        }
    }, [focusIndex]);

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

        shadowRoot.replaceChildren(unoVariables, style, container);

        setShadowContainer(container);

        return () => {
            setShadowContainer(null);
            shadowRoot.replaceChildren();
        };
    }, []);

    return (
        <div style={{ position: "relative" }}>
            <div
                ref={hostRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 100,
                }}
            />

            {shadowContainer &&
                createPortal(
                    <div
                        onClick={stopPropagation(
                            setFocusIndex,
                            getIndexById(id),
                        )}
                        className='absolute inset-0 group hover:border-1 border-primary'>
                        <div className='flex absolute top-0 left--1 translate-y-[-100%] opacity-0 group-hover:opacity-100! transition-opacity duration-200'>
                            <p className='bg-primary text-white px-2 py-1 rounded-tl-md rounded-tr-md text-[16px] font-600 mb-0'>
                                {name}
                            </p>
                        </div>

                        <div className='flex absolute top-0 right-1 gap-1 translate-y-[-100%] opacity-0 group-hover:opacity-100! transition-opacity duration-200 pointer-events-auto'>
                            <button
                                type='button'
                                onClick={stopPropagation(removeData, id)}
                                className='btn btn-danger px-1 py-.7 text-white rounded-b-0'>
                                <DeleteIcon className='text-[16px]' />
                            </button>

                            <button
                                type='button'
                                onClick={stopPropagation(handleMove, "down")}
                                className='btn btn-primary px-1 pt-1 pb-1  rounded-b-0'>
                                <ChevronIcon className='text-[16px] text-white' />
                            </button>

                            <button
                                type='button'
                                onClick={stopPropagation(handleMove, "up")}
                                className='btn btn-primary px-1 pt-1 pb-1 rounded-b-0'>
                                <ChevronIcon className='text-[16px] text-white rotate-180' />
                            </button>
                        </div>
                    </div>,
                    shadowContainer,
                )}
            {children}
        </div>
    );
}
