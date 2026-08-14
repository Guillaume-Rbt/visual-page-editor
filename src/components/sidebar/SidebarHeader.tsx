import { useCallback } from "react";
import { usePartialStore } from "../../Store";
import { translation } from "../../visual-editor";
import { RoundedButton } from "../ui/RoundedButton";
import CodeIcon from "../../assets/imgs/code.svg?react";

export function SidebarHeader() {
    const { setInsertIndex, data } = usePartialStore("setInsertIndex", "data");

    const handleClick = useCallback(() => {
        setInsertIndex(data.length);
    }, [setInsertIndex, data]);

    const handleCopy = useCallback(async () => {
        const jsonData = JSON.stringify(data, null, 2);

        try {
            await navigator.clipboard.writeText(jsonData);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }, [data]);

    return (
        <div className='w-full flex items-center p-2 border-b border-ve-dark/10'>
            <div className='flex items-center ml-auto gap-2'>
                <RoundedButton
                    onClick={handleCopy}
                    classes={"hover:bg-ve-dark/10 p-1"}>
                    <CodeIcon className='text-5' />
                </RoundedButton>
                <button className='btn btn-ve-primary' onClick={handleClick}>
                    {translation("addComponent")}
                </button>
            </div>
        </div>
    );
}
