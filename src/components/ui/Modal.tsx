import Close from "../../assets/imgs/close.svg?react";
import { BlockItem } from "../blocksLibrary/BlockItem";
import { RoundedButton } from "./RoundedButton";
import { stringifyValue } from "../../utils/utils";

export function Modal({
    title,
    visible = true,
    onVisibilityChange,
    children,
    classes = "",
}: {
    title: string;
    visible?: boolean;
    onVisibilityChange?: (visible: boolean) => void;
    children?: React.ReactNode;
    classes?: string | string[];
}) {
    return (
        <div
            className={`position-fixed inset-0 bg-ve-dark/50 flex items-center justify-center z-index-50 ${visible ? "flex" : "hidden"}`}>
            <div
                className={`rounded-2 font-bold flex flex-col bg-ve-light overflow-hidden min-w-[300px] w-full  max-w-[80%] max-h-[80%] ${stringifyValue(classes)}`}>
                <ModalHeader
                    title={title}
                    onClose={() => onVisibilityChange?.(false)}
                />
                <div className='overflow-auto p-4 w-full'>{children}</div>
            </div>
        </div>
    );
}

function ModalHeader({
    title,
    onClose,
}: {
    title: string;
    onClose: () => void;
}) {
    return (
        <div className='w-full h-10 flex flex-items-center gap-2 p-is-4 p-ie-2'>
            <h1 className=' py-3 text-5'>{title}</h1>
            <ModalClose onClick={onClose} />
        </div>
    );
}

function ModalClose({ onClick }: { onClick: () => void }) {
    return (
        <RoundedButton
            onClick={onClick}
            classes='p-1 ml-auto hover:bg-ve-dark/10'>
            <Close className='text-6' />
        </RoundedButton>
    );
}
