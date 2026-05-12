import { usePartialStore } from "../../Store";
import { PreviewBloc } from "./PreviewBloc";

export function PreviewBlocs({ initHTML }: { initHTML: Record<string, string> }) {
    const { data } = usePartialStore("data");

    return (
        <>
            {data.map((bloc, i) => {
                return <PreviewBloc key={i} data={data[i]} html={initHTML[bloc._id]}></PreviewBloc>;
            })}
        </>
    );
}
