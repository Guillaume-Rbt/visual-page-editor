import { useContext } from "react";
import { usePartialStore } from "../../Store";
import { ButtonAddComponent } from "../ui/ButtonAddComponent";
import { SidebarBloc } from "./SidebarBloc";

export function SidebarBlocs() {
  const { value } = usePartialStore("value");

  return (
    <>
      <ButtonAddComponent index={0}></ButtonAddComponent>
      <div className="flex flex-col px-2 gap-2">
        {value.map((bloc, k) => {
          return (
            <SidebarBloc
              id={k}
              key={k}
              name={bloc.name}
              data={bloc}
            ></SidebarBloc>
          );
        })}
        <pre>{JSON.stringify(value)}</pre>
      </div>
    </>
  );
}
