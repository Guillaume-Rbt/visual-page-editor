import { useState } from "react";
import { ComponentValue } from "../types";
import { useDebounce } from "./useDebounce";

export function useBlockPreview(data: ComponentValue, previewUrl: string, initial: string) {
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
        200,
    );

    return html;
}
