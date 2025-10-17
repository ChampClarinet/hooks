import type { RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ========================= useOutsideAlerter ========================= */

/**
 * A React hook that invokes a callback when a pointer/keyboard event happens outside a given element.
 *
 * @param ref - The target element ref to guard.
 * @param handler - Callback fired when an outside interaction is detected.
 * @param options - Optional configuration.
 * @param options.eventType - DOM event type to listen to (default: `"pointerdown"`).
 * @param options.enabled - Toggle listener on/off (default: `true`).
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useOutsideAlerter(ref, () => setOpen(false));
 */
export function useOutsideAlerter(
  ref: React.RefObject<HTMLElement | null>,
  handler?: () => void,
  options?: { eventType?: keyof DocumentEventMap; enabled?: boolean },
): void {
  const { eventType = "pointerdown", enabled = true } = options ?? {};
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled || typeof document == "undefined") return;

    const onEvent = (e: Event) => {
      const el = ref.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (target && !el.contains(target)) {
        handlerRef.current?.();
      }
    };

    document.addEventListener(eventType, onEvent, { capture: true });

    return () => {
      document.removeEventListener(eventType, onEvent, { capture: true });
    };
  }, [enabled, eventType, ref]);
}

/* ============================ useWindowSize ========================== */

/**
 * Tracks the current viewport size and updates on resize/orientation changes.
 *
 * @returns A tuple `[width, height]` of the current window size.
 *
 * @remarks
 * - SSR-safe: initializes as `[0, 0]` and updates on client.
 * - Debounced with `requestAnimationFrame` to reduce layout thrashing.
 */
export function useWindowSize(): [number, number] {
  const [size, setSize] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = 0;
    const update = () => {
      rafId = window.requestAnimationFrame(() => {
        setSize([window.innerWidth, window.innerHeight]);
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return size;
}

/* ============================= useBreakpoint ========================= */

/**
 * Returns `true` when the viewport width is less than the given breakpoint.
 *
 * @param breakpoint - Width threshold in pixels.
 * @returns Whether the viewport width is smaller than `breakpoint`.
 */
export function useBreakpoint(breakpoint: number): boolean {
  const [width] = useWindowSize();

  return useMemo(() => width > 0 && width < breakpoint, [breakpoint, width]);
}

/**
 * Observes an element's box size using `ResizeObserver` (with window-resize fallback),
 * returning `[width, height]`.
 *
 * @param ref - Ref to the target HTMLElement to observe.
 * @returns A tuple `[width, height]` of the element's current size.
 *
 * @remarks
 * - Uses `ResizeObserver` when available for accurate measurements.
 * - Falls back to `window.resize` if `ResizeObserver` is not supported.
 */
export function useElementSize(ref: RefObject<HTMLElement | null>): [number, number] {
  const [size, setSize] = useState<[number, number]>([
    ref.current?.clientWidth ?? 0,
    ref.current?.clientHeight ?? 0,
  ]);

  const readSize = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Prefer border-box size when available, but we recompute from DOM here for compatibility
    const width = Math.max(el.offsetWidth, el.clientWidth);
    const height = Math.max(el.offsetHeight, el.clientHeight);
    setSize([width, height]);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof ResizeObserver != "undefined") {
      const ro = new ResizeObserver(() => readSize());
      ro.observe(el);

      // prime
      readSize();
      return () => ro.disconnect();
    }

    // Fallback: listen to window resize
    readSize();
    window.addEventListener("resize", readSize);
    return () => {
      window.removeEventListener("resize", readSize);
    };
  }, [readSize, ref]);

  return size;
}

/* =========================== useReMountComponent ===================== */

/**
 * Returns a counter that increments after a specified threshold, which can be used
 * as a React `key` to force a subtree remount.
 *
 * @param threshold - Delay in milliseconds before incrementing the counter (default: `30000`).
 * @param options - Optional behavior flags.
 * @param options.pauseWhenHidden - Pause the timer while the document is hidden (default: `true`).
 * @returns The incrementing counter value.
 *
 * @example
 * const key = useReMountComponent(10_000);
 * return <ExpensiveWidget key={key} />;
 */
export function useReMountComponent(
  threshold: number = 30_000,
  options?: { pauseWhenHidden?: boolean },
): number {
  const { pauseWhenHidden = true } = options ?? {};
  const [refreshCount, setRefreshCount] = useState(0);
  const timerRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (timerRef.current != null) return;
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setRefreshCount((c) => c + 1);
    }, threshold);
  }, [threshold]);

  const stop = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window == "undefined") return;
    start();

    if (!pauseWhenHidden) {
      return () => stop();
    }

    const onVisibility = () => {
      stop();
      if (document.visibilityState == "visible") start();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [pauseWhenHidden, start, stop]);

  return refreshCount;
}

/* ============================= useOrientation ======================== */

export type Orientation = "portrait" | "landscape";

/**
 * Provides the current screen orientation `"portrait"` or `"landscape"`.
 *
 * @returns The current {@link Orientation}, or `null` if undetectable.
 *
 * @remarks
 * - Uses `matchMedia` queries under the hood; works on iOS Safari where `ScreenOrientation` API is limited.
 * - Debounced via `requestAnimationFrame` to avoid rapid state flips during rotation.
 */
export function useOrientation(): Orientation | null {
  const [orientation, setOrientation] = useState<Orientation | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;
    const compute = () => {
      raf = requestAnimationFrame(() => {
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;

        if (isPortrait) setOrientation("portrait");
        else if (isLandscape) setOrientation("landscape");
        else setOrientation(null);
      });
    };

    compute();
    window.addEventListener("orientationchange", compute);
    window.addEventListener("resize", compute); // some browsers only fire resize

    return () => {
      window.removeEventListener("orientationchange", compute);
      window.removeEventListener("resize", compute);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return orientation;
}
