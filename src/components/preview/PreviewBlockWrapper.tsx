import { usePartialStore } from "../../Store";
import ChevronIcon from "../../assets/imgs/arrow.svg?react";

export function PreviewBlockWrapper({ children, id }: { children: React.ReactNode; id: string }) {
    const { moveBlock, removeData, getIndexById } = usePartialStore("moveBlock", "removeData", "getIndexById");

    const handleMove = (direction: "up" | "down") => {
        const currentIndex = getIndexById(id);
        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        moveBlock(currentIndex, newIndex);
    };

    return (
        <div className='relative '>
            <div className='absolute w-full h-full hover:border-1 border-primary  group'>
                <div className='flex absolute top-0 right-1 gap-1 translate-y-[-100%] opacity-0 group-hover:opacity-100! transition-opacity duration-200'>
                    <div onClick={() => handleMove("down")} className='btn btn-primary px-1'>
                        <ChevronIcon className='text-4 text-white' />
                    </div>
                    <div onClick={() => handleMove("up")} className='btn btn-primary px-1   '>
                        <ChevronIcon className='text-4 text-white rotate-180' />
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
}
