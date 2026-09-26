import { useCallback, useEffect, useRef, useState } from "react";

// A section becomes active once its heading scrolls above this line (px from the viewport top).
// Headings land at ~96px after scrollIntoView (scroll-mt-24), so they sit just above it.
const ACTIVATION_OFFSET = 140;

export function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);
  // True while a sidebar click is smooth-scrolling; the clicked section stays highlighted
  // until scrolling settles, however long the jump takes.
  const locked = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const update = () => {
      if (locked.current) {
        clearTimeout(settleTimer.current);
        settleTimer.current = setTimeout(() => { locked.current = false; }, 150);
        return;
      }

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= ACTIVATION_OFFSET) current = id;
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearTimeout(settleTimer.current);
    };
  }, [ids]);

  const scrollTo = useCallback((id: string) => {
    locked.current = true;
    setActiveId(id);
    // Unlock even if the click causes no scroll at all (already in place).
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => { locked.current = false; }, 300);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return { activeId, scrollTo };
}
