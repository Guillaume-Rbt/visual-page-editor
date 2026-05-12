import { memo } from "react";
import { useBlocPreview } from "../../hooks/useBlocPreview";
import { useEditorContext } from "../../Store";
import { BlocValue } from "../../types";

export function component({ html: initial, data }: { html: string; data: BlocValue }) {
    const { urlPreview } = useEditorContext();

    const html = useBlocPreview(data, urlPreview, initial);

    return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
}

export const PreviewBloc = memo(component);
