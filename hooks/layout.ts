import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { wait } from "@/utils";

export const useOutsideAlerter = (
  ref: React.MutableRefObject<any>,
  handler?: () => any,
  eventType: keyof DocumentEventMap = "mousedown"
) => {
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      ref.current && !ref.current.contains(e.target) && handler && handler();
    };
    document.addEventListener(eventType, handleClickOutside);
    return () => document.removeEventListener(eventType, handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
};

/**
 * Use this to get screen width and height and listening their changes.
 * @returns tuple [width, height]
 */
export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);

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

export const useBreakpoint = (breakpoint: number) => {
  const [width] = useWindowSize();

  const isInBreakpoint = useMemo(() => width < breakpoint, [breakpoint, width]);

  return isInBreakpoint;
};

export const useCheckMobileSize = () => {
  return useBreakpoint(768);
};

export const useElementSize = (
  ref: RefObject<HTMLElement> | MutableRefObject<HTMLDivElement | undefined>
) => {
  const [size, setSize] = useState([
    ref.current?.offsetWidth || 0,
    ref.current?.offsetHeight || 0,
  ]);

  const updateSize = useCallback(() => {
    const w = ref.current?.offsetWidth || 0;
    const h = ref.current?.offsetHeight || 0;
    setSize([w, h]);
  }, [ref]);

  useEffect(() => {
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [ref, updateSize]);

  useEffect(() => {
    updateSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return size;
};

/**
 * Bind key returns from this hook at component assigned to be remounted
 * @param threshold time in milliseconds to trigger remounting, default is 30 seconds.
 */
export const useReMountComponent = (threshold = 30e3) => {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleReMountComponent = useCallback(() => {
    setTimeout(() => setRefreshCount((prev) => ++prev), threshold);
  }, [threshold]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("blur", handleReMountComponent);
    }
    return () => {
      window.removeEventListener("blur", handleReMountComponent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return refreshCount;
};

export type Orientation = "portrait" | "landscape";

/**
 * Provide current orientation of the device.
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<null | Orientation>(null);

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
