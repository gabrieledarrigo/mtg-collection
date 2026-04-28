import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("should execute the callback after the specified delay", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(300));

    act(() => {
      result.current(callback);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should cancel the previous callback when called again within the delay", () => {
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const { result } = renderHook(() => useDebounce(300));

    act(() => {
      result.current(firstCallback);
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      result.current(secondCallback);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  it("should only execute the latest callback when called multiple times rapidly", () => {
    const callbacks = [jest.fn(), jest.fn(), jest.fn()];
    const { result } = renderHook(() => useDebounce(300));

    act(() => {
      callbacks.forEach((cb) => result.current(cb));
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(callbacks[0]).not.toHaveBeenCalled();
    expect(callbacks[1]).not.toHaveBeenCalled();
    expect(callbacks[2]).toHaveBeenCalledTimes(1);
  });

  it("should return a stable function reference across renders", () => {
    const { result, rerender } = renderHook(() => useDebounce(300));
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });
});
