import { memo } from "react";
import { useBlockPreview } from "../../hooks/useBlockPreview";
import { useEditorContext } from "../../Store";
import { ComponentValue } from "../../types";

export function component({
    html: initial,
    data,
}: {
    html: string;
    data: ComponentValue;
}) {
    const { previewUrl } = useEditorContext();

    const html = useBlockPreview(data, previewUrl, initial);

    return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
}

export const PreviewBlock = memo(component);
