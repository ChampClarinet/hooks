import { useCallback, useEffect } from "react";

/**
 * Debounces a function call by delaying its execution.
 * @param handler The function to be debounced
 * @param delay The delay in milliseconds before executing the function (default is 1000ms)
 */
export const useDebounce = (handler: () => void, delay = 1000) => {
  const debouncedHandler = useCallback(() => {
    const timeout = setTimeout(handler, delay);
    return () => clearTimeout(timeout);
  }, [handler, delay]);

  useEffect(() => {
    return debouncedHandler();
  }, [debouncedHandler]);
};
