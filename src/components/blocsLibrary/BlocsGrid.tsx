import { usePartialStore } from "../../Store";
import { BlocItem } from "./BlocItem";

export function BlocsGrid() {
  const { blocs, insertData, setInsertIndex } = usePartialStore(
    "blocs",
    "insertData",
    "setInsertIndex",
  );

  return (
    <div className="grid  md-grid-cols-[repeat(5,170px)] sm-grid-cols-[repeat(auto-fit,1fr)]  gap-2 justify-start">
      {blocs.map((bloc) => {
        return (
          <BlocItem
            handleClick={() => {
              insertData(bloc);
              setInsertIndex(null);
            }}
            key={bloc.label}
            name={bloc.label}
          />
        );
      })}
    </div>
  );
}
