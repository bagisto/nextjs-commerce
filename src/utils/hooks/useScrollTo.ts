"use client";

import { useCallback, useEffect } from "react";

export const useScrollTo = () => {
    const scrollTo = useCallback((options?: ScrollToOptions) => {
        if (typeof window !== "undefined") {
            window.scrollTo(options || { top: 0, behavior: "smooth" });
        }
    }, []);

    return scrollTo;
};

export const useScrollToTop = () => {
    const scrollTo = useScrollTo();

    useEffect(() => {
        scrollTo({ top: 0, behavior: "smooth" });
    }, [scrollTo]);
};
