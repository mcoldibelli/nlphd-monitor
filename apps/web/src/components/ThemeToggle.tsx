"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Mount gate to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("theme") as "light" | "dark" | null;
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const next = saved ?? (prefersDark ? "dark" : "light");
      applyTheme(next);
    } catch {}
  }, []);

  function applyTheme(next: "light" | "dark") {
    setTheme(next);
    try {
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    } catch {}
  }

  function toggle() {
    applyTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <button
      type="button"
      aria-label={`Ativar tema ${theme === "light" ? "escuro" : "claro"}`}
      title={`Tema: ${theme === "light" ? "claro" : "escuro"}`}
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:shadow transition ${className}`}
    >
      {mounted && theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      <span className="text-sm">{mounted ? (theme === "dark" ? "Escuro" : "Claro") : "Tema"}</span>
      <span className="sr-only">Alternar tema</span>
    </button>
  );
}
