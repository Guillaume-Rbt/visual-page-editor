import { Ref } from "react";
import { stringifyValue } from "../../utils/utils";

export function RoundedButton({
    children,
    onClick = () => {},
    classes,
    ref,
    ...props
}: {
    ref?: Ref<HTMLButtonElement>;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    classes: string | string[];
}) {
    return (
        <button ref={ref} {...props} onClick={onClick} className={`square rounded-full ${stringifyValue(classes)}`}>
            {children}
        </button>
    );
}
