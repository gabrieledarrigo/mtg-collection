import { useCallback, useRef } from "react";

export type Callback = (...args: unknown[]) => void;

/**
 * Creates a debounce function that delays callback execution.
 *
 * @param delay - The number of milliseconds to delay the callback execution.
 * @returns A function that accepts a callback and executes it after the specified delay, canceling any previously scheduled execution.
 */
export function useDebounce(delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (callback: Callback) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(callback, delay);
    },
    [delay],
  );
}
