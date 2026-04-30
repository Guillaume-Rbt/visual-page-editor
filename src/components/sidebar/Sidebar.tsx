import { SidebarBlocs } from "./SidebarBlocs";

export function Sidebar() {
  return (
    <div className="w-full h-full text-dark bg-white flex flex-col shadow-lg shadow-dark/40">
      <SidebarBlocs></SidebarBlocs>
    </div>
  );
}
