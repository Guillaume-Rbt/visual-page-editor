import { useMemo } from "react";
import { usePartialStore } from "../../Store";
import { BlocValue } from "../../types";
import { FieldRenderer } from "./FieldRenderer";
import { FieldsRenderer } from "./FieldsRenderer";

export function SidebarBloc({
  name,
  id,
  data,
}: {
  name: string;
  id: number;
  data: BlocValue;
}) {
  const { blocs } = usePartialStore("blocs");

  const blocData = useMemo(() => {
    return blocs.find((b) => b.name === name);
  }, [name]);

  return (
    <div className="flex flex-col shadow rounded-.6 gap-4 border-[1px] border-dark/20 px-4 py-4">
      <h2 className="font-bold text-5">{blocData?.label}</h2>

      <div className="flex flex-col gap-2">
        <FieldsRenderer
          dataPath={`${id}`}
          fields={blocData!.fields ?? []}
          data={data}
        />
      </div>
    </div>
  );
}
