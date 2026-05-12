import { useCallback, useEffect, useMemo, useRef } from "react";
import { debounce } from "../utils/utils";

export function useDebounce(callback: Function, deps: any[], time: number) {
    console.log("jjjjjjj");

    const callbackRef = useRef<Function>(callback);
    const debouncedCallback = useMemo(() => {
        return debounce((...args: any[]) => callbackRef.current(...args), time);
    }, []);
    callbackRef.current = callback;

    useEffect(() => {
        debouncedCallback();
    }, deps);
}
