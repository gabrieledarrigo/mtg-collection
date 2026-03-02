"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

/**
 * A custom hook that returns a function to update URL search parameters.
 * The returned function accepts a record of parameter names and values,
 * where setting a value to `null` will remove that parameter from the URL.
 *
 * @returns A function that updates the URL search parameters and navigates to the new URL.
 */
export function useUpdateSearchParams(): (
  params: Record<string, string | null>,
) => void {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return function updateSearchParams(
    params: Record<string, string | null>,
  ): void {
    const newParams = new URLSearchParams([...searchParams.entries()]);

    Object.entries(params).forEach(([param, value]) =>
      value ? newParams.set(param, value) : newParams.delete(param),
    );

    return router.push(`${pathname}?${newParams}`);
  };
}
