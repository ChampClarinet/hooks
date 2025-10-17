import { useCallback, useEffect, useRef } from "react";

/**
 * A React hook that returns a debounced version of a function.
 * The debounced function delays invoking `fn` until after `delay` milliseconds
 * have elapsed since the last time the debounced function was called.
 *
 * @template TArgs
 * @param {(...args: TArgs) => void} fn - The function to debounce.
 * @param {number} [delay=300] - Delay in milliseconds before executing `fn` (default: 300ms).
 * @param {boolean} [immediate=false] - If true, invoke `fn` immediately on the first call,
 * then debounce subsequent calls.
 * @returns {(...args: TArgs) => void} - A debounced version of `fn`.
 *
 * @example
 * ```tsx
 * const handleInput = useDebounce((value: string) => {
 *   console.log("Searching for:", value);
 * }, 500);
 *
 * <input onChange={(e) => handleInput(e.target.value)} />
 * ```
 *
 * @remarks
 * - Safe with React concurrent rendering.
 * - The returned function reference is stable (memoized with `useCallback`).
 * - Automatically clears the timeout when the component unmounts.
 */
export function useDebounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay: number = 300,
  immediate: boolean = false,
): (...args: TArgs) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);

  // Always reference latest fn
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debounced = useCallback(
    (...args: TArgs) => {
      const callNow = immediate && !timeoutRef.current;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (!immediate) fnRef.current(...args);
      }, delay);

      if (callNow) fnRef.current(...args);
    },
    [delay, immediate],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debounced;
}
