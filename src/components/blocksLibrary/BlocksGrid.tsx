import { usePartialStore } from "../../Store";
import { BlockItem } from "./BlockItem";

export function BlocksGrid() {
    const { blocks, insertData, setInsertIndex } = usePartialStore("blocks", "insertData", "setInsertIndex");

    return (
        <div className='grid  md-grid-cols-[repeat(5,170px)] sm-grid-cols-[repeat(auto-fit,1fr)]  gap-2 justify-start'>
            {blocks.map((block) => {
                return (
                    <BlockItem
                        handleClick={() => {
                            insertData(block);
                            setInsertIndex(null);
                        }}
                        key={block.label}
                        name={block.name}
                        label={block.label}
                    />
                );
            })}
        </div>
    );
}
