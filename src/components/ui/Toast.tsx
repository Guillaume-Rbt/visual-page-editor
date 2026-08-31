import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";
import CloseIcon from "../../assets/imgs/close.svg?react";
import { v4 as uuid } from "uuid";
type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
    id: string;
    title: string;
    message: string;
    type: ToastType;
    duration: number;
    actions?: {
        type: "primary" | "secondary";
        label: string;
        onClick: () => void;
    }[];
};

type ToastContextType = {
    addToast: (
        {
            title,
            message,
            type,
            actions,
        }: {
            title: string;
            message: string;
            type?: ToastType;
            actions?: {
                type: "primary" | "secondary";
                label: string;
                onClick: () => void;
            }[];
        },
        duration?: number,
    ) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (
            {
                title,
                message,
                type = "info",
                actions,
            }: {
                title: string;
                message: string;
                type?: ToastType;
                actions?: {
                    type: "primary" | "secondary";
                    label: string;
                    onClick: () => void;
                }[];
            },
            duration: number = 3000,
        ) => {
            const id = uuid();
            if (!document.startViewTransition) {
            }
            setToasts((current) => [
                ...current,
                {
                    id,
                    title,
                    message,
                    type,
                    duration,
                    actions,
                },
            ]);

            setTimeout(() => {
                removeToast(id);
            }, duration);
        },
        [removeToast],
    );

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            <div className='fixed right-4 bottom-4 z-[9999] flex flex-col gap-2'>
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const colors = {
        success: "var(--colors-ve-success)",
        error: "var(--colors-ve-danger)",
        warning: "var(--colors-ve-warning)",
        info: "var(--colors-ve-primary)",
    };

    const actionsBtnType = {
        primary: "btn-ve-primary",
        secondary: "btn-outline-primary",
    };

    return (
        <div
            style={{
                boxShadow: `0 4px 6px 1px color-mix(in srgb, ${colors[toast.type]} 26%, transparent)`,
            }}
            className={`
        min-w-[300px]
        text-dark
        bg-ve-white
        rounded-2
        overflow-hidden toast
      `}>
            <div className='flex flex-col items-start '>
                <div className='flex flex-col gap-3 p-4 w-full'>
                    <div className='flex justify-between items-start gap-4 w-full'>
                        <p className='font-600 text-4.5'>{toast.title}</p>

                        <button
                            type='button'
                            onClick={onClose}
                            className='opacity-70 hover:opacity-100 ml-auto'>
                            <CloseIcon />
                        </button>
                    </div>
                    <span className='flex-1'>{toast.message}</span>
                    <div className='flex gap-2 justify-end'>
                        {toast.actions?.map((action, index) => (
                            <button
                                key={index}
                                className={`btn ${actionsBtnType[action.type]} text-4 px-2.5 font-400  rounded-2`}
                                onClick={() => {
                                    action.onClick();
                                    onClose();
                                }}>
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        background: colors[toast.type],
                        animationDuration: `${toast.duration}ms`,
                    }}
                    className='h-1 w-full toast-timer '></div>
            </div>
        </div>
    );
}
export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
}
