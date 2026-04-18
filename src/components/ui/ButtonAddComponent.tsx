import { usePartialStore } from "../../Store";

export function ButtonAddComponent({ index }: { index: number }) {
  const { setInsertIndex } = usePartialStore("setInsertIndex");

  return (
    <button onClick={() => setInsertIndex(index)}>Add at index {index}</button>
  );
}
