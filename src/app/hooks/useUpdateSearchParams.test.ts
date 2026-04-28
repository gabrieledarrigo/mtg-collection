import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useUpdateSearchParams } from "./useUpdateSearchParams";
import { act } from "react";
import * as navigation from "next/navigation";
import { createMock } from "@test/helpers";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

jest.mock("next/navigation");

describe("useUpdateSearchParams", () => {
  const router = createMock<AppRouterInstance>({
    push: jest.fn(),
  });

  const pathname = "/collection";

  const searchParams = createMock<navigation.ReadonlyURLSearchParams>({
    entries: () => [],
  });

  beforeEach(() => {
    jest.spyOn(navigation, "useRouter").mockReturnValue(router);
    jest.spyOn(navigation, "usePathname").mockReturnValue(pathname);
    jest.spyOn(navigation, "useSearchParams").mockReturnValue(searchParams);
  });

  it("should add multiple search parameters to the URL", () => {
    const params = {
      foo: "bar",
      baz: "qoo",
      taa: ["one", "two"],
    };

    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current(params);
    });

    expect(router.push).toHaveBeenCalledWith(
      `${pathname}?foo=bar&baz=qoo&taa=one&taa=two`,
    );
  });

  it("should preserve existing params", () => {
    const withExistingParams = createMock<navigation.ReadonlyURLSearchParams>({
      entries: () => [["param", "value"]],
    });

    jest
      .spyOn(navigation, "useSearchParams")
      .mockReturnValue(withExistingParams);

    const params = {
      foo: "bar",
    };

    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current(params);
    });

    expect(router.push).toHaveBeenCalledWith(`${pathname}?param=value&foo=bar`);
  });

  it("should update existing params", () => {
    const withExistingParams = createMock<navigation.ReadonlyURLSearchParams>({
      entries: () => [["param", "value"]],
    });

    jest
      .spyOn(navigation, "useSearchParams")
      .mockReturnValue(withExistingParams);

    const params = {
      param: "newValue",
    };

    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current(params);
    });

    expect(router.push).toHaveBeenCalledWith(`${pathname}?param=newValue`);
  });

  it("should remove existing params", () => {
    const withExistingParams = createMock<navigation.ReadonlyURLSearchParams>({
      entries: () => [
        ["param", "value"],
        ["taa", "one"],
      ],
    });

    jest
      .spyOn(navigation, "useSearchParams")
      .mockReturnValue(withExistingParams);

    const params = {
      param: null,
      taa: ["two", "three"],
    };

    const { result } = renderHook(() => useUpdateSearchParams());

    act(() => {
      result.current(params);
    });

    expect(router.push).toHaveBeenCalledWith(`${pathname}?taa=two&taa=three`);
  });
});
