import { create } from "zustand";
import type { QuizResult } from "../types/quiz";

const HISTORY_KEY = "cn-quiz-history";

function loadHistory(): QuizResult[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveHistory(results: QuizResult[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(results));
}

interface HistoryStore {
  results: QuizResult[];
  addResult: (result: QuizResult) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  results: loadHistory(),

  addResult: (result) => {
    const updated = [result, ...get().results];
    saveHistory(updated);
    set({ results: updated });
  },

  clearHistory: () => {
    saveHistory([]);
    set({ results: [] });
  },
}));
