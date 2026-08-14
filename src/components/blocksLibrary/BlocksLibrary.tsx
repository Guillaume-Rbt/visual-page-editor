import { useBlocksLibraryVisible, usePartialStore } from "../../Store";
import { translation } from "../../utils/utils";
import { Modal } from "../ui/Modal";
import { Search } from "../ui/Search";
import { BlocksGrid } from "./BlocksGrid";
import { Categories } from "./Categories";

export function BlocksLibrary() {
    const visible = useBlocksLibraryVisible();
    const { setInsertIndex, blocks } = usePartialStore(
        "setInsertIndex",
        "blocks",
    );

    const onVisibilityChange = (v: any) => {
        setInsertIndex(null);
    };

    return (
        <Modal
            classes='h-[80%] overflow-auto'
            visible={visible}
            onVisibilityChange={onVisibilityChange}
            title={translation("addComponent")}>
            <div className='flex flex-col w-full align-start'></div>
            <Categories blocks={blocks} />
        </Modal>
    );
}
