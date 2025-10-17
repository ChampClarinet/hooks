/**
 * Delays execution for a specified number of milliseconds.
 *
 * This utility function returns a Promise that resolves after the given time.
 * It’s often used for adding artificial delays, throttling async actions,
 * or waiting between re-renders and animations.
 *
 * @example
 * ```ts
 * await wait(500); // pauses execution for 500ms
 * console.log("done!");
 * ```
 *
 * @param {number} [ms=1000] - The number of milliseconds to wait before resolving. Defaults to 1000ms.
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 */
export async function wait(ms: number = 1000): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
