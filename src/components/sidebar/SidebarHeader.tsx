import { useCallback, useContext } from "react";
import { useEditorContext, usePartialStore } from "../../Store";
import { translation } from "../../visual-editor";
import { RoundedButton } from "../ui/RoundedButton";
import CodeIcon from "../../assets/imgs/code.svg?react";
import CloseIcon from "../../assets/imgs/close.svg?react";
import { Tooltip } from "../ui/Tooltip";

export function SidebarHeader() {
    const { setInsertIndex, data } = usePartialStore("setInsertIndex", "data");

    const { rootElement } = useEditorContext();

    const handleClose = useCallback(() => {
        rootElement.setAttribute("shown", "false");
    }, [rootElement]);

    const handleClick = useCallback(() => {
        setInsertIndex(data.length);
    }, [setInsertIndex, data]);

    const handleCopy = useCallback(async () => {
        const jsonData = JSON.stringify(data, null, 2);

        rootElement.pasteData = true;

        try {
            await navigator.clipboard.writeText(jsonData);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }

        rootElement.addEventListener("paste", async (event) => {
            rootElement.setAttribute(
                "value",
                await navigator.clipboard.readText(),
            );
        });
    }, [data]);

    return (
        <div className='w-full flex items-center p-2 border-b border-ve-dark/10'>
            <Tooltip text={translation("closeEditor")}>
                <RoundedButton
                    classes={"hover:bg-ve-dark/10 p-1"}
                    onClick={handleClose}>
                    <CloseIcon className='text-5' />
                </RoundedButton>
            </Tooltip>

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
