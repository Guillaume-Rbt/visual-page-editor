import { useBlocksLibraryVisible, usePartialStore } from "../../Store";
import { translation } from "../../utils/utils";
import { Modal } from "../ui/Modal";
import { BlocksGrid } from "./BlocksGrid";
import { Categories } from "./Categories";

export function BlocksLibrary() {
    const visible = useBlocksLibraryVisible();
    const { setInsertIndex, blocks } = usePartialStore("setInsertIndex", "blocks");

    const onVisibilityChange = (v: any) => {
        setInsertIndex(null);
    };

    return (
        <Modal
            visible={visible}
            onVisibilityChange={onVisibilityChange}
            title={translation("addComponent")}>
            <Categories blocks={blocks} />
        </Modal>
    );
}
