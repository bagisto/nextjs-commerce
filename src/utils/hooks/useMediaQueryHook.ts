"use client";
import { useEffect, useState, useCallback } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  const handleChange = useCallback((e: MediaQueryListEvent) => {
    setMatches(e.matches);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMatches(media.matches);

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [query, handleChange]);

  return matches;
}
