import { memo } from "react";
import { useBlocData, useBlocDefinition } from "../../Store";
import { FieldsRenderer } from "./FieldsRenderer";

export const SidebarBloc = memo(function SidebarBloc({ name, id }: { name: string; id: string }) {
    const blocDefinition = useBlocDefinition(name);
    const data = useBlocData(id);

    return (
        <div className='bg-white w-full flex flex-col shadow rounded-.6 gap-4 border-[1px] border-dark/20 px-4 py-4'>
            <h2 className='font-bold text-5'>{blocDefinition?.label}</h2>

            <div className='flex flex-col gap-2'>
                <FieldsRenderer dataPath={`${id}`} fields={blocDefinition!.fields ?? []} data={data} />
            </div>
        </div>
    );
});
