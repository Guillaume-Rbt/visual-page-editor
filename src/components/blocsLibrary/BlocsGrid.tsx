import { usePartialStore } from "../../Store";
import { BlocItem } from "./BlocItem";

export function BlocsGrid() {
  const { blocs } = usePartialStore("blocs");

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,_250px)] gap-2 justify-start">
      {blocs.map((bloc) => {
        return <BlocItem key={bloc.name} name={bloc.name} />;
      })}
    </div>
  );
}
