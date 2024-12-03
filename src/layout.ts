import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { wait } from "./utils";

/**
 * Custom hook to detect clicks outside a specified element.
 * @param {React.MutableRefObject<any>} ref - The ref object of the element to detect clicks outside of.
 * @param {() => any} [handler] - Optional. The callback function to execute when a click outside the element is detected.
 * @param {keyof DocumentEventMap} [eventType='mousedown'] - Optional. The type of event to listen for. Defaults to 'mousedown'.
 */
export const useOutsideAlerter = (
  ref: React.MutableRefObject<any>,
  handler?: () => any,
  eventType: keyof DocumentEventMap = "mousedown"
) => {
  useEffect(() => {
    /**
     * Handles click events outside the specified element.
     * @param {Event} e - The click event.
     */
    const handleClickOutside = (e: Event) => {
      ref.current && !ref.current.contains(e.target) && handler && handler();
    };
    document.addEventListener(eventType, handleClickOutside);
    return () => document.removeEventListener(eventType, handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
};

/**
 * Custom hook to get the screen width and height and listen for their changes.
 * @returns {Array<number>} - An array containing the current width and height [width, height].
 */
export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);

  /**
   * Updates the size state with the current window width and height.
   */
  const updateSize = useCallback(() => {
    typeof window != "undefined" &&
      setSize([window.innerWidth, window.innerHeight]);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  useEffect(() => {
    updateSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return size;
};

/**
 * Custom hook to determine if the current window width is less than a specified breakpoint.
 * @param {number} breakpoint - The breakpoint width to compare against.
 * @returns {boolean} - True if the current window width is less than the specified breakpoint, otherwise false.
 */
export const useBreakpoint = (breakpoint: number) => {
  const [width] = useWindowSize();

  const isInBreakpoint = useMemo(() => width < breakpoint, [breakpoint, width]);

  return isInBreakpoint;
};

/**
 * Custom hook to get the size (width and height) of a DOM element and listen for changes.
 * @param {RefObject<HTMLElement>} ref - Reference to the DOM element whose size needs to be tracked.
 * @returns {number[]} - An array containing the width and height of the DOM element.
 */
export const useElementSize = (
  ref: RefObject<HTMLElement | null>
): number[] => {
  const [size, setSize] = useState([
    ref.current?.clientWidth || 0,
    ref.current?.clientHeight || 0,
  ]);

  const updateSize = useCallback(() => {
    if (ref.current) {
      const { offsetWidth, offsetHeight, clientHeight, clientWidth } = ref.current;
      const width = Math.max(offsetWidth, clientWidth);
      const height = Math.max(offsetHeight, clientHeight);
      setSize([width, height]);
    }
  }, [ref]);

  useEffect(() => {
    if (typeof window !== "undefined")
      window.addEventListener("resize", updateSize);

    return () => {
      if (typeof window !== "undefined")
        window.removeEventListener("resize", updateSize);
    };
  }, [ref, updateSize]);

  useEffect(() => {
    updateSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return size;
};

/**
 * Custom hook to trigger remounting of the component after a specified threshold time.
 * @param {number} threshold - Time in milliseconds to trigger remounting. Default is 30 seconds.
 * @returns {number} - The number of times the component has been remounted.
 */
export const useReMountComponent = (threshold: number = 30000): number => {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleReMountComponent = useCallback(() => {
    const timeoutId = setTimeout(() => {
      setRefreshCount((prevCount) => prevCount + 1);
    }, threshold);

    return () => clearTimeout(timeoutId);
  }, [threshold]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const blurListener = () => handleReMountComponent();

      window.addEventListener("blur", blurListener);
    }

    return () => {
      if (typeof window !== "undefined")
        window.removeEventListener("blur", handleReMountComponent);
    };
  }, [handleReMountComponent]);

  return refreshCount;
};

/**
 * Custom hook to provide the current orientation of the device.
 * @returns {Orientation | null} - The current orientation of the device, either "portrait" or "landscape", or null if unknown.
 */
export const useOrientation = (): Orientation | null => {
  const [orientation, setOrientation] = useState<Orientation | null>(null);

  useEffect(() => {
    const handleOrientationChange = async () => {
      await wait(100); //? handle resizing lag
      if (typeof window !== "undefined") {
        if (window.matchMedia("(orientation: portrait)").matches) {
          setOrientation("portrait");
        } else if (window.matchMedia("(orientation: landscape)").matches) {
          setOrientation("landscape");
        } else {
          setOrientation(null);
          console.error("Unknown orientation");
        }
      }
    };

    handleOrientationChange();

    if (typeof window !== "undefined")
      window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      if (typeof window !== "undefined")
        window.removeEventListener(
          "orientationchange",
          handleOrientationChange
        );
    };
  }, []);

  return orientation;
};

export type Orientation = "portrait" | "landscape";
