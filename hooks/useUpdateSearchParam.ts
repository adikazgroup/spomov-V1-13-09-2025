"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type ParamsInput =
  | Record<string, string | number | boolean | null | undefined>
  | string;

type Options = {
  /** replace instead of push (default: true) */
  replace?: boolean;
  /** keep scroll position (Next.js router option) */
  scroll?: boolean;
};

/**
 * Update one or more search params and navigate.
 * - Pass a key and value or an object map of keys/values.
 * - Falsy values (undefined, null, "") remove the key.
 */
export default function useUpdateSearchParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // client-only

  const updateSearchParam = useCallback(
    (keyOrParams: ParamsInput, value?: unknown, opts: Options = {}) => {
      const { replace = true, scroll } = opts;

      // Start from current params
      const params = new URLSearchParams(searchParams.toString());

      const setOrDelete = (k: string, v: unknown) => {
        if (v === undefined || v === null || v === "") {
          params.delete(k);
        } else {
          params.set(k, String(v));
        }
      };

      if (typeof keyOrParams === "string") {
        setOrDelete(keyOrParams, value);
      } else if (keyOrParams && typeof keyOrParams === "object") {
        Object.entries(keyOrParams).forEach(([k, v]) => setOrDelete(k, v));
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.error("Invalid argument passed to updateSearchParam");
        }
        return;
      }

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      if (replace) {
        router.replace(url, { scroll });
      } else {
        router.push(url, { scroll });
      }
    },
    [pathname, router, searchParams]
  );

  return updateSearchParam;
}
