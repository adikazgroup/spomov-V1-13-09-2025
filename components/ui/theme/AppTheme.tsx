"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export function AppTheme() {
  const { theme, setTheme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const SWITCH_THEME = () => {
    switch (theme) {
      case "light":
        setTheme("dark");
        return;
      case "dark":
        setTheme("system");
        return;
      case "system":
        setTheme(systemTheme === "dark" ? "light" : "dark");
        return;
    }
  };

  return (
    <div className=" flex justify-center  fixed right-0 top-0 ">
      <button
        onClick={SWITCH_THEME}
        className="size-8 border border-gray-600 dark:border-gray-200  cursor-pointer relative rounded-md "
      >
        {theme === "light" ? (
          <div className="absolute w-full h-full left-0 top-0 center shrink-0 size-6 text-black  dark:scale-0 scale-100  dark:rotate-45 rotate-0 ani2">
            <Icon icon="lucide:sun-medium" />
          </div>
        ) : theme === "dark" ? (
          <div className="absolute w-full h-full left-0 top-0 center shrink-0 size-6 text-gray-200  dark:scale-100 scale-0  dark:rotate-0 rotate-45 ani2 ">
            <Icon icon="lucide:moon-star" />
          </div>
        ) : (
          <div className="absolute w-full h-full left-0 top-0 center shrink-0 size-6 text-gray-200  ani2">
            <Icon icon="lucide:laptop" />
          </div>
        )}
      </button>
    </div>
  );
}
