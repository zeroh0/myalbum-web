"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M20.742 13.045a8.088 8.088 0 0 1-2.077.273c-4.492 0-8.131-3.639-8.131-8.131 0-1.076.207-2.11.583-3.055a.5.5 0 0 0-.634-.654C6.949 2.94 4 6.982 4 11.5 4 17.299 8.701 22 14.5 22c4.036 0 7.813-2.325 9.622-5.978a.5.5 0 0 0-.588-.7 8.086 8.086 0 0 1-2.792.223 6 6 0 0 1 0-.023z" />
    </svg>
  );
}

export default function ThemeToggle() {
  // 서버 렌더링/첫 클라이언트 렌더링은 항상 이 기본값(라이트)으로 맞춰서
  // 하이드레이션 불일치를 피하고, 실제 테마는 마운트 이후에만 반영한다.
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // 하이드레이션 직후 실제 DOM 테마 상태로 한 번만 동기화한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function handleSystemChange(e: MediaQueryListEvent) {
      if (localStorage.getItem("theme")) return;
      const next = e.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    }
    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  function handleToggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
    setTheme(next);
  }

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-700 shadow-lg ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-800 dark:hover:bg-zinc-800"
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
