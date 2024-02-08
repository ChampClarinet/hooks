import { useCallback, useState } from "react";

/**
 * Provides state management for controlling the visibility of a modal.
 * @param initialState The initial state of the modal (default is false, meaning the modal is closed)
 * @returns An object containing the modal state and functions to open, close, and toggle the modal
 */
export const useModalState = (initialState = false) => {
  const [state, setState] = useState(initialState);

  /**
   * Opens the modal.
   */
  const open = useCallback(() => setState(true), []);

  /**
   * Closes the modal.
   */
  const close = useCallback(() => setState(false), []);

  /**
   * Toggles the state of the modal (opens if closed, closes if open).
   */
  const toggle = useCallback(() => setState((prev) => !prev), []);

  return {
    state,
    open,
    close,
    toggle,
  };
};
