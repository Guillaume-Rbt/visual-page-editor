import { BlocsLibrary } from "./blocsLibrary/BlocsLibrary";
import { Sidebar } from "./sidebar/Sidebar";

export function Layout() {
  return (
    <div className="w-full h-full grid grid-cols-[30rem_1fr]">
      <Sidebar></Sidebar>
      <BlocsLibrary></BlocsLibrary>
    </div>
  );
}
