import { Fragment, useContext } from "react";
import { usePartialStore } from "../../Store";
import { ButtonAddComponent } from "../ui/ButtonAddComponent";
import { SidebarBloc } from "./SidebarBloc";

export function SidebarBlocs() {
    const { data } = usePartialStore("data");

    return (
        <>
            <div className='flex w-full flex-col px-2 gap-1'>
                <ButtonAddComponent index={0}></ButtonAddComponent>
                {data.map((bloc, k) => {
                    return (
                        <Fragment key={bloc._id}>
                            <SidebarBloc id={bloc._id} name={bloc._name}></SidebarBloc>
                            <ButtonAddComponent index={k + 1}></ButtonAddComponent>
                        </Fragment>
                    );
                })}
            </div>
        </>
    );
}
