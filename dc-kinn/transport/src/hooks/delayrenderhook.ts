import { useState, useEffect } from "react";
export const useDelayedRender = (delay: any): any => {
    const [delayed, setDelayed] = useState(true);
    useEffect(() => {
        const timeout = setTimeout(() => setDelayed(false), delay);
        return () => clearTimeout(timeout);
    }, []);
    return (fn: any) => !delayed && fn();
};