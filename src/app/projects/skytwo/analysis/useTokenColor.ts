"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

// Leaflet writes colours into SVG attributes, where CSS variables don't resolve,
// so read the theme tokens once per theme and pass real colour strings.
export function useTokenColor() {
  const { resolvedTheme } = useTheme();
  return useMemo(() => {
    const css = typeof window === "undefined" ? null : getComputedStyle(document.documentElement);
    return (token: string) => (css ? `hsl(${css.getPropertyValue(`--fl-${token}`).trim()})` : "#888");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme]);
}

