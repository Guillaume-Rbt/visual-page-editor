import { useState } from "react";
import { BlocksLibrary } from "./blocksLibrary/BlocksLibrary";
import Preview from "./preview/Preview";
import { Sidebar } from "./sidebar/Sidebar";
import EditIcon from "../assets/imgs/edit.svg?react";
import PreviewIcon from "../assets/imgs/preview.svg?react";

export function Layout({ visible = true }: { visible?: boolean }) {
    const [previewVisible, setPreviewVisible] = useState(false);

    return (
        <div
            className={`ve-editor w-full h-full overflow-hidden grid-rows-[100%] grid max-md:grid-cols-1 lg:grid-cols-[30rem_1fr] max-md:grid-rows-[calc(100%_-_2.5rem)_1fr] md:grid-cols-[50%_1fr] ${visible ? "editor-visible" : "editor-hidden"}`}>
            <div
                className={`w-full h-full max-md:col-start-1 max-md:row-start-1 ${previewVisible ? "max-md:opacity-0 max-md:pointer-events-none" : "max-md:opacity-100"} transition-[opacity] duration-200`}>
                <Sidebar></Sidebar>
            </div>
            <div
                className={`w-full h-full max-md:col-start-1 max-md:row-start-1 ${!previewVisible ? "max-md:opacity-0 max-md:pointer-events-none" : "max-md:opacity-100"} transition-[opacity] duration-200`}>
                <Preview />
            </div>

            <MobileViewToggle
                onClick={(v) => setPreviewVisible(v)}
                isPreviewVisible={previewVisible}
            />

            <BlocksLibrary></BlocksLibrary>
        </div>
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

        console.log("action", e.currentTarget.closest("button"));

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
