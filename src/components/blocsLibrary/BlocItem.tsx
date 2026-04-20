import { useEditorContext } from "../../Store";
import { translation } from "../../utils/utils";

export function BlocItem({ name }: { name: string }) {
  const { iconsUrl } = useEditorContext();

  return (
    <div className="flex flex-justify-center flex-col w-full h-full p-2 hover:bg-dark/10 rounded-2 gap-2">
      <img
        src={`${iconsUrl}/${name.replace(/ /g, "-")}.svg`}
        alt={`${translation("iconFor")} ${name}`}
      />
      <span>{name}</span>
    </div>
  );
}
