import { useContext } from "react";
import { useEditorContext, usePartialStore } from "../../Store";
import { ButtonAddComponent } from "../ui/ButtonAddComponent";

export function SidebarBlocs() {
  const { blocs, value } = usePartialStore("blocs", "value");

  console.log(blocs, value);

  return (
    <>
      <ButtonAddComponent index={0}></ButtonAddComponent>
      {JSON.stringify(value)}
    </>
  );
}
