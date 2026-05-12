import { useEditorContext } from "../../Store";
import { translation } from "../../utils/utils";

export function BlocItem({ name, label, handleClick }: { name: string; label: string; handleClick: () => void }) {
    const { iconsUrl } = useEditorContext();

    const iconName = name.replace(/ /g, "-");
    const iconUrl = iconsUrl.replace("{{name}}", iconName);

    return (
        <div
            onClick={handleClick}
            className='flex flex-justify-center flex-col w-full h-full p-2 hover:bg-dark/10 rounded-2 gap-2'>
            <img src={iconUrl} alt={`${translation("iconFor")} ${label}`} />
            <span>{label}</span>
        </div>
    );
}
