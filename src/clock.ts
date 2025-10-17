import { useEffect, useState } from "react";

/**
 * A lightweight clock hook that returns the current `Date` and updates on an interval.
 *
 * @param {UseClockOptions} [options] - Optional configuration.
 * @param {number}   [options.interval=1000] - Tick interval in milliseconds.
 * @param {boolean}  [options.immediate=false] - If `true`, updates once immediately on mount.
 * @param {boolean}  [options.pauseWhenHidden=true] - If `true`, pauses ticking when the tab is hidden to save resources.
 *
 * @returns {Date} The current time (`Date`) updated on the configured interval.
 *
 * @example
 * // Default tick every 1s
 * const now = useClock();
 *
 * @example
 * // Custom interval + immediate update on mount
 * const now = useClock({ interval: 500, immediate: true });
 *
 * @remarks
 * - The hook uses `setInterval`, so ticks are not monotonic and may drift under heavy load or throttling.
 * - With `pauseWhenHidden=true`, ticking stops on background tabs and resumes when visible again.
 * - Safe for SSR: state is lazily initialized on the client.
 */
export function useClock(options: UseClockOptions = {}): Date {
  const { interval = 1000, immediate = false, pauseWhenHidden = true } = options;

  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    let intervalId: null | number = null;

    const start = () => {
      if (immediate) setCurrentTime(new Date());
      intervalId = window.setInterval(() => setCurrentTime(new Date()), interval);
    };

    const stop = () => {
      if (intervalId != null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    if (pauseWhenHidden && typeof document !== "undefined") {
      const onVisibility = () => {
        stop();
        if (document.visibilityState === "visible") start();
      };

      document.addEventListener("visibilitychange", onVisibility);
      start();

      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        stop();
      };
    }

    // No visibility pausing
    start();
    return () => {
      stop();
    };
  }, [interval, immediate, pauseWhenHidden]);

  return currentTime;
}

/** Options for {@link useClock}. */
export interface UseClockOptions {
  /** Tick interval in milliseconds (default: 1000). */
  interval?: number;
  /** Update once immediately on mount (default: false). */
  immediate?: boolean;
  /** Pause ticking when document is hidden (default: true). */
  pauseWhenHidden?: boolean;
}
