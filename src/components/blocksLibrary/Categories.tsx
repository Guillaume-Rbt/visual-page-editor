import { ComponentDefinition } from "../../types";
import { Tabs } from "../ui/Tabs";
import { useMemo, useState } from "react";
import { BlocksGrid } from "./BlocksGrid";
import { translation } from "../../visual-editor";
import { Search } from "../ui/Search";

export function Categories({ blocks }: { blocks: ComponentDefinition[] }) {
    const [searchValue, setSearchValue] = useState("");
    const blocsCategories = useMemo(() => {
        const blocsCategories = new Map<string, ComponentDefinition[]>();

        const sortedBlocks = [...blocks].sort((a, b) =>
            a.label.localeCompare(b.label),
        );

        blocsCategories.set(translation("allCategory"), sortedBlocks);

        for (const block of sortedBlocks) {
            if (!block.category) continue;

            const categoryBlocks = blocsCategories.get(block.category) ?? [];
            categoryBlocks.push(block);

            blocsCategories.set(block.category, categoryBlocks);
        }

        return new Map(
            [...blocsCategories.entries()].sort(([categoryA], [categoryB]) => {
                if (categoryA === translation("allCategory")) return -1;
                if (categoryB === translation("allCategory")) return 1;

                return categoryA.localeCompare(categoryB, undefined, {
                    sensitivity: "base",
                });
            }),
        );
    }, [blocks]);

    return (
        <div className='flex flex-col gap-7 w-full'>
            <div className='mt-7 flex justify-center'>
                <Search
                    onChange={(value) => {
                        setSearchValue(value);
                    }}
                    value={searchValue}
                />
            </div>

            {(blocsCategories.size > 1 && (
                <Tabs labels={Array.from(blocsCategories.keys())}>
                    {Array.from(blocsCategories.entries()).map(
                        ([category, blocks]) => (
                            <BlocksGrid
                                blocks={blocks.filter((b) => {
                                    if (!searchValue) return true;
                                    return b.label
                                        .toLowerCase()
                                        .includes(searchValue.toLowerCase());
                                })}
                                key={category}
                            />
                        ),
                    )}
                </Tabs>
            )) || <BlocksGrid blocks={blocks} />}
        </div>
    );
}
