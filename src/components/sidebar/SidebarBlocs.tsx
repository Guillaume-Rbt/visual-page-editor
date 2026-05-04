import { useContext } from "react";
import { usePartialStore } from "../../Store";
import { ButtonAddComponent } from "../ui/ButtonAddComponent";
import { SidebarBloc } from "./SidebarBloc";

export function SidebarBlocs() {
    const { value } = usePartialStore("value");

    return (
        <>
            <div className='flex flex-col px-2 gap-1'>
                <ButtonAddComponent index={0}></ButtonAddComponent>
                {value.map((bloc, k) => {
                    return (
                        <>
                            <SidebarBloc id={bloc._id} key={k} name={bloc._name}></SidebarBloc>
                            <ButtonAddComponent index={k + 1}></ButtonAddComponent>
                        </>
                    );
                })}
                <pre>{JSON.stringify(value, null, 2)}</pre>
            </div>
        </>
    );
}
