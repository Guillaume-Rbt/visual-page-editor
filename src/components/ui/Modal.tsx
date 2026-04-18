import Close from "../../assets/imgs/close.svg?react";

export function Modal({
  title,
  visible = true,
  onVisibilityChange,
  children,
}: {
  title: string;
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`position-fixed inset-0 bg-dark/50 flex items-center justify-center z-index-50 ${visible ? "flex" : "hidden"}`}
    >
      <div className="rounded-2 font-bold bg-white overflow-hidden w-[80%]">
        <ModalHeader
          title={title}
          onClose={() => onVisibilityChange?.(false)}
        />
      </div>
      <div>{children}</div>
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
    <div className="w-full flex flex-items-center  gap-2">
      <span className="p-is-4">{title}</span>
      <ModalClose onClick={onClose} />
    </div>
  );
}

function ModalClose({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 color-dark hover:bg-dark/10 ml-auto"
    >
      <Close className="text-6" />
    </button>
  );
}
