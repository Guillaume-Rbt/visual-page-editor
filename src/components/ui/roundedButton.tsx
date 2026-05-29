import { stringifyValue } from "../../utils/utils";

export function RoundedButton({
    children,
    onClick = () => {},
    classes,
}: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    classes: string | string[];
}) {
    return (
        <button onClick={onClick} className={`square rounded-full ${stringifyValue(classes)}`}>
            {children}
        </button>
    );
}
