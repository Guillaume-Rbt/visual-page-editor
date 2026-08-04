import { usePartialStore } from "../../Store";
import ChevronIcon from "../../assets/imgs/arrow.svg?react";
import DeleteIcon from "../../assets/imgs/delete.svg?react";

export function PreviewBlockWrapper({ children, id, name }: { children: React.ReactNode; id: string; name: string }) {
    const { moveBlock, removeData, getIndexById } = usePartialStore("moveBlock", "removeData", "getIndexById");

    const handleMove = (direction: "up" | "down") => {
        const currentIndex = getIndexById(id);
        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        moveBlock(currentIndex, newIndex);
    };

    return (
        <div className='relative '>
            <div className='absolute w-full h-full hover:border-1 border-primary  group'>
                <div className='flex absolute top-0 left--1  translate-y-[-100%] opacity-0 group-hover:opacity-100! transition-opacity duration-200'>
                    <p className='bg-primary/15 text-primary px-2 py-1 rounded-tl-md rounded-tr-md text-3.5 font-600 mb-0'>
                        {name}
                    </p>
                </div>
                <div className='flex absolute top-0 right-1 gap-1 translate-y-[-100%] opacity-0 group-hover:opacity-100! transition-opacity duration-200'>
                    <div onClick={() => removeData(id)} className='btn btn-primary px-1 text-white hover:color-danger'>
                        <DeleteIcon className='text-5' />
                    </div>
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
