import { BlocksLibrary } from "./blocksLibrary/BlocksLibrary";
import Preview from "./preview/Preview";
import { Sidebar } from "./sidebar/Sidebar";

export function Layout({ visible = true }: { visible?: boolean }) {
    return (
        <div
            className={`w-full h-full overflow-hidden grid-rows-[100%] grid grid-cols-[30rem_1fr] ${visible ? "editor-visible" : "editor-hidden"}`}>
            <Sidebar></Sidebar>
            <Preview />
            <BlocksLibrary></BlocksLibrary>
        </div>
    );
}
