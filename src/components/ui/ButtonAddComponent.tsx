import { usePartialStore } from "../../Store";
import AddIcon from "../../assets/imgs/add.svg?react";
import useBoolean from "../../hooks/useBoolean";

export function ButtonAddComponent({ index }: { index: number }) {
    const { setInsertIndex } = usePartialStore("setInsertIndex");

    const [isDisplayed, show, hide] = useBoolean(false);

    return (
        <div
            className={`w-full h-.5 isolate rounded-1 flex bg-dark/40 position-relative flex flex-justify-center flex-items-center ${isDisplayed ? "opacity-100" : "opacity-0"}`}>
            <div
                onMouseMove={show}
                onMouseEnter={show}
                onMouseLeave={hide}
                className='w-full h-5 position-absolute top--2 left-0'></div>
            <button
                onMouseEnter={show}
                onMouseLeave={hide}
                className={`btn btn-primary btn-rounded position-relative ${isDisplayed ? "" : "pointer-events-none"}`}
                onClick={() => setInsertIndex(index)}>
                <AddIcon className='text-8' />
            </button>
        </div>
    );
}
