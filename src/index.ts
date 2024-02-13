import { useCallback, useEffect } from "react";

/**
 * Debounces a function call by delaying its execution.
 * @param {Function} handler The function to be debounced.
 * @param {number} [delay=1000] The delay in milliseconds before executing the function (default is 1000ms).
 * @returns {Function} The debounced version of the handler function.
 */
export const useDebounce = (
  handler: () => void,
  delay: number = 1000
): Function => {
  /**
   * Debounced version of the handler function.
   * @returns {void}
   */
  const debouncedHandler = useCallback(() => {
    const timeout = setTimeout(handler, delay);
    return () => clearTimeout(timeout);
  }, [handler, delay]);

  // Call the debounced handler effect
  useEffect(() => {
    return debouncedHandler();
  }, [debouncedHandler]);

  return debouncedHandler;
};
