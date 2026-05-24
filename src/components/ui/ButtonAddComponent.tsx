import { useCallback } from "react";
import { usePartialStore } from "../../Store";
import AddIcon from "../../assets/imgs/add.svg?react";
import useBoolean from "../../hooks/useBoolean";

export function ButtonAddComponent({ addType = "after", blocId }: { addType?: "before" | "after"; blocId: string }) {
    const { setInsertIndex, getIndexById } = usePartialStore("setInsertIndex", "getIndexById");

    const [isDisplayed, show, hide] = useBoolean(false);

    const handleClick = useCallback(() => {
        let index = getIndexById(blocId);

        if (addType === "after") index++;
        setInsertIndex(index);
    }, [getIndexById, blocId, setInsertIndex]);

    return (
        <div
            className={`w-full left-0 h-.5 isolate z-2 rounded-1 flex bg-dark/40 position-absolute flex flex-justify-center flex-items-center ${isDisplayed ? "opacity-100" : "opacity-0"} ${addType === "after" ? "top-full mt-.5" : "top--.5 mb-.5"}`}>
            <div
                onMouseMove={show}
                onMouseEnter={show}
                onMouseLeave={hide}
                className='w-full h-5 position-absolute top--2 left-0'></div>
            <button
                onMouseEnter={show}
                onMouseLeave={hide}
                className={`btn btn-primary btn-rounded position-relative ${isDisplayed ? "" : "pointer-events-none"}`}
                onClick={handleClick}>
                <AddIcon className='text-6' />
            </button>
        </div>
    );
}
