import { ComponentDefinition } from "../../types";
import { Tabs } from "../ui/Tabs";
import { useEffect, useMemo } from "react";
import { BlocksGrid } from "./BlocksGrid";
import { translation } from "../../visual-editor";

export function Categories({ blocks }: { blocks: ComponentDefinition[] }) {
    const blocsCategories = useMemo(() => {
        const blocsCategories = new Map<string, ComponentDefinition[]>();

        blocsCategories.set(translation("allCategory"), blocks);

        blocks.forEach((block) => {
            const category = block.category;

            if(!category) {
                return;
            }

            if (!blocsCategories.has(category)) {
                blocsCategories.set(category, []);
            }
            blocsCategories.get(category)!.push(block);
        });
        return blocsCategories;
    }, [blocks]);

    return (
        <>
            {blocsCategories.size > 1 && (
                <Tabs labels={Array.from(blocsCategories.keys())}>
                    {Array.from(blocsCategories.entries()).map(
                        ([category, blocks]) => (
                            <BlocksGrid blocks={blocks} key={category} />
                        ),
                    )}
                </Tabs>
            ) || <BlocksGrid blocks={blocks} />}
        </>
    );
}
