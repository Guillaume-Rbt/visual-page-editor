import { useEffect, useRef } from "react";
import { useEditorContext, useDataGetter, usePartialStore } from "../../Store";
import useBoolean from "../../hooks/useBoolean";
import { Loader } from "../ui/Loader";
import { PreviewBlocs } from "./PreviewBlocs";
import { createPortal } from "react-dom";
import { BlocValue } from "../../types";
import { useAsync } from "../../hooks/useAsync";

export default function Preview() {
    const getData = useDataGetter();
    const { urlPreview } = useEditorContext();
    const data = useRef<BlocValue[]>([]);
    const iframe = useRef<HTMLIFrameElement>(null);
    const htmlAdded = useRef(false);
    const root = useRef<HTMLDivElement>(null);
    const initHTML = useRef({});
    const [loaded, setLoadedTrue] = useBoolean(false);

    useAsync(async () => {
        data.current = getData();
        const r = await fetch(urlPreview, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data.current),
        });
        const html = await r.text();
        iframe.current!.srcdoc = html;

        htmlAdded.current = true;
    }, []);

    const onLoad = () => {
        if (!htmlAdded.current) return;

        const iFrameDoc = iframe.current!.contentDocument!;

        const componentsRoot = iFrameDoc.querySelector("#components-root") as HTMLDivElement;
        root.current = componentsRoot;
        initHTML.current = Array.from(componentsRoot.children).reduce((acc, c, i) => {
            return { ...acc, [data.current[i]!._id]: c.outerHTML };
        }, {});
        root.current.innerHTML = "";
        setLoadedTrue();
    };

    return (
        <div className='w-[calc(100%_-_2_*var(--spacing))] h-full left-2 relative'>
            {!loaded && <Loader />}
            <iframe
                onLoad={onLoad}
                className={`h-full top-0 left-0 position-absolute w-full transition-opacity ${!loaded ? "opacity-0" : "opacity-100"}`}
                ref={iframe}></iframe>
            {loaded && createPortal(<PreviewBlocs initHTML={initHTML.current}></PreviewBlocs>, root.current!)}
        </div>
    );
}
