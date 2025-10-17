import { useCallback, useState } from "react";

/**
 * Represents the return type of the `useModalState` hook.
 */
export interface UseModalStateReturn {
  /** Current visibility state of the modal. */
  state: boolean;

  /** Opens the modal. */
  open: () => void;

  /** Closes the modal. */
  close: () => void;

  /** Toggles modal visibility (open ↔ close). */
  toggle: () => void;

  /** Resets the modal state back to its initial value. */
  reset: () => void;
}

/**
 * React hook for managing modal visibility state.
 *
 * Provides helpers to open, close, toggle, and reset modal state.
 * Useful for controlling dialogs, drawers, or overlays.
 *
 * @example
 * ```tsx
 * const { state, open, close, toggle, reset } = useModalState();
 *
 * return (
 *   <>
 *     <button onClick={open}>Open modal</button>
 *     {state && (
 *       <Modal onClose={close}>
 *         <h2>Hello!</h2>
 *         <button onClick={reset}>Reset</button>
 *       </Modal>
 *     )}
 *   </>
 * );
 * ```
 *
 * @param {boolean} [initialState=false] - Initial modal state (true = open, false = closed).
 * @returns {UseModalStateReturn} Modal state and control functions.
 */
export function useModalState(initialState: boolean = false): UseModalStateReturn {
  const [state, setState] = useState(initialState);

  const open = useCallback(() => setState(true), []);
  const close = useCallback(() => setState(false), []);
  const toggle = useCallback(() => setState((prev) => !prev), []);
  const reset = useCallback(() => setState(initialState), [initialState]);

  return {
    state,
    open,
    close,
    toggle,
    reset,
  };
}
