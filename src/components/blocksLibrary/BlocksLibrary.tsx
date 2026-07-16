import { useBlocksLibraryVisible, usePartialStore } from "../../Store";
import { translation } from "../../utils/utils";
import { Modal } from "../ui/Modal";
import { BlocksGrid } from "./BlocksGrid";

export function BlocksLibrary() {
    const visible = useBlocksLibraryVisible();
    const { setInsertIndex } = usePartialStore("setInsertIndex");

    const onVisibilityChange = (v: any) => {
        setInsertIndex(null);
    };

    return (
        <Modal visible={visible} onVisibilityChange={onVisibilityChange} title={translation("addComponent")}>
            <BlocksGrid />
        </Modal>
    );
}
