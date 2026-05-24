import { BlocsLibrary } from "./blocsLibrary/BlocsLibrary";
import Preview from "./preview/Preview";
import { Sidebar } from "./sidebar/Sidebar";

export function Layout() {
    return (
        <div className='w-full h-full grid-rows-[100%] grid grid-cols-[30rem_1fr]'>
            <Sidebar></Sidebar>
            <Preview />
            <BlocsLibrary></BlocsLibrary>
        </div>
    );
}
