import { usePartialStore } from "../../Store";
import { ComponentDefinition } from "../../types";
import { BlockItem } from "./BlockItem";

export function BlocksGrid({ blocks }: { blocks: ComponentDefinition[] }) {
    const { insertData, setInsertIndex } = usePartialStore(
        "insertData",
        "setInsertIndex",
    );

    return (
        <div className='grid  grid-cols-[repeat(auto-fit,minmax(170px,250px))]   gap-2 justify-start'>
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
