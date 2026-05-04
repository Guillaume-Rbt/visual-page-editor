import { SidebarBlocs } from "./SidebarBlocs";

export function Sidebar() {
    return (
        <div className='bg-background-light w-full h-full text-dark bg-white flex flex-col flex-items-center shadow-lg shadow-dark/40'>
            <SidebarBlocs></SidebarBlocs>
        </div>
    );
}
