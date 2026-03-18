import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("quiz-app-theme") || localStorage.getItem("cn-quiz-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("quiz-app-theme", theme);
}

const initial = getInitialTheme();
applyTheme(initial);

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initial,
  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    applyTheme(next);
    set({ theme: next });
  },
}));
