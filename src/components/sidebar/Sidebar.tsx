import { SidebarBlocks } from "./SidebarBlocks";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

export function Sidebar() {
    return (
        <div className='bg-background-light w-full h-full text-dark bg-white flex flex-col flex-items-center shadow-lg shadow-dark/40 select-none'>
            <SidebarHeader></SidebarHeader>
            <SidebarBlocks></SidebarBlocks>
            <SidebarFooter></SidebarFooter>
        </div>
    );
}
