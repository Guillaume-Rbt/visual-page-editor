import { useState } from "react";
import { BlocValue } from "../types";
import { useDebounce } from "./useDebounce";

export function useBlocPreview(data: BlocValue, previewUrl: string, initial: string) {
    const [html, setHTML] = useState(initial);
    useDebounce(
        () => {
            fetch(previewUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data }),
            })
                .then((r) => r.text())
                .then(setHTML);
        },
        [data],
        250,
    );

    return html;
}
