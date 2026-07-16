import { memo } from "react";
import { useBlockPreview } from "../../hooks/useBlockPreview";
import { useEditorContext } from "../../Store";
import { ComponentValue } from "../../types";

export function component({ id, html: initial, data }: { id: string; html: string; data: ComponentValue }) {
    const { urlPreview } = useEditorContext();

    const html = useBlockPreview(data, urlPreview, initial);

    return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
}

export const PreviewBlock = memo(component);
