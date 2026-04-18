import { useBlocsLibraryVisible, usePartialStore } from "../../Store";
import { translation } from "../../utils/utils";
import { Modal } from "../ui/Modal";

export function BlocsLibrary() {
  const visible = useBlocsLibraryVisible();
  const { setInsertIndex } = usePartialStore("setInsertIndex");

  const onVisibilityChange = (v: any) => {
    setInsertIndex(null);
  };

  return (
    <Modal
      visible={visible}
      onVisibilityChange={onVisibilityChange}
      title={translation("addComponent")}
    ></Modal>
  );
}
