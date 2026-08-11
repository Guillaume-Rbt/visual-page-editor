import { usePartialStore } from "../../Store";
import { ComponentDefinition } from "../../types";
import { BlockItem } from "./BlockItem";

export function BlocksGrid({ blocks }: { blocks: ComponentDefinition[] }) {
    const { insertData, setInsertIndex } = usePartialStore(
        "insertData",
        "setInsertIndex",
    );

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
