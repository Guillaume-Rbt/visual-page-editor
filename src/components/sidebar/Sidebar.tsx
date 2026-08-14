import { SidebarBlocks } from "./SidebarBlocks";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

export function Sidebar() {
    return (
        <div className='bg-background-light w-full h-full text-ve-dark bg-ve-light flex flex-col flex-items-center md:shadow-lg md:shadow-ve-dark/40 select-none '>
            <SidebarHeader></SidebarHeader>
            <SidebarBlocks></SidebarBlocks>
            <SidebarFooter></SidebarFooter>
        </div>
    );
}
