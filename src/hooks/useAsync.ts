import { useEffect } from "react";

export function useAsync(cb: Function, deps: unknown[]) {
    useEffect(() => {
        cb();
    }, deps);
}
