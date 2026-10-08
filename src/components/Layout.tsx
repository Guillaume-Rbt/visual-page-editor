import { useEffect, useRef, useState } from "react";
import { BlocksLibrary } from "./blocksLibrary/BlocksLibrary";
import Preview from "./preview/Preview";
import { Sidebar } from "./sidebar/Sidebar";
import EditIcon from "../assets/imgs/edit.svg?react";
import PreviewIcon from "../assets/imgs/preview.svg?react";

export function Layout({ visible = true }: { visible?: boolean }) {
    const [previewVisible, setPreviewVisible] = useState(false);

    const [isResizing, setIsResizing] = useState(false);

    const [sizerValue, setSizerValue] = useState<number | null>(null);

    const sidebarWidth = `clamp(min(30rem, 50%), ${sizerValue ?? 0}px, 50%)`;

    return (
        <div
            style={{ "--ve-sidebar-w": sidebarWidth } as React.CSSProperties}
            className={`ve-editor relative w-full h-full overflow-hidden grid-rows-[100%] grid max-md:grid-cols-1 max-md:grid-rows-[calc(100%_-_2.5rem)_1fr] md:grid-cols-[var(--ve-sidebar-w)_1fr] ${visible ? "editor-visible" : "editor-hidden"}`}>
            <div
                className={`w-full h-full max-md:col-start-1 max-md:row-start-1 ${previewVisible ? "max-md:opacity-0 max-md:pointer-events-none" : "max-md:opacity-100"} transition-[opacity] duration-200`}>
                <Sidebar></Sidebar>
            </div>

            <div
                className={`${isResizing ? "pointer-events-none" : ""} w-full h-full max-md:col-start-1 max-md:row-start-1 ${!previewVisible ? "max-md:opacity-0 max-md:pointer-events-none" : "max-md:opacity-100"} transition-[opacity] duration-200`}>
                <Preview />
            </div>
            <Sizer
                onResize={setSizerValue}
                onMouseDown={() => setIsResizing(true)}
                onMouseUp={() => setIsResizing(false)}
                left={sidebarWidth}
            />
            <MobileViewToggle
                onClick={(v) => setPreviewVisible(v)}
                isPreviewVisible={previewVisible}
            />

            <BlocksLibrary></BlocksLibrary>
        </div>
    );
}

function Sizer({
    onResize,
    onMouseDown,
    onMouseUp,
    left,
}: {
    onResize: (size: number) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseUp?: () => void;
    left: string;
}) {
    const isResizing = useRef(false);
    const element = useRef<HTMLDivElement | null>(null);
    const callbacks = useRef({ onResize, onMouseUp });
    callbacks.current = { onResize, onMouseUp };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        isResizing.current = true;
        onMouseDown?.(e);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return;
            const container = element.current?.parentElement;
            if (!container) return;
            callbacks.current.onResize(
                e.clientX - container.getBoundingClientRect().left,
            );
        };

        const handleMouseUp = () => {
            if (!isResizing.current) return;
            isResizing.current = false;
            callbacks.current.onMouseUp?.();
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div
            ref={element}
            style={{ left }}
            onMouseDown={handleMouseDown}
            className='max-md:hidden h-full z-999 absolute top-0 -translate-x-1/2 cursor-col-resize w-2 bg-ve-dark/0 hover:bg-ve-dark/10 transition-colors'></div>
    );
}

function MobileViewToggle({
    onClick,
    isPreviewVisible,
}: {
    onClick: (v: boolean) => void;
    isPreviewVisible: boolean;
}) {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const action = (e.target as HTMLElement).closest("button")?.dataset
            .action;

        if (!action) return;
        onClick(action === "preview");
    };

    return (
        <div
            onClick={handleClick}
            className='w-full flex md-hidden justify-center items-center'>
            <button
                data-action='edit'
                className={`px-4 py-2 text-5 ${!isPreviewVisible ? "bg-ve-primary text-ve-light" : "bg-ve-light text-black"} cursor-pointer`}>
                <EditIcon />
            </button>
            <button
                data-action='preview'
                className={`px-4 py-2 text-5 ${isPreviewVisible ? "bg-ve-primary text-ve-light" : "bg-ve-light text-black"} cursor-pointer`}>
                <PreviewIcon />
            </button>
        </div>
    );
}
