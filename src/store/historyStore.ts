import { create } from "zustand";
import type { QuizResult } from "../types/quiz";
import { useSubjectStore } from "./subjectStore";

function getHistoryKey(): string {
  const subjectId = useSubjectStore.getState().subjectId;
  return `${subjectId}-quiz-history`;
}

function loadHistory(): QuizResult[] {
  const subjectId = useSubjectStore.getState().subjectId;
  if (!subjectId) return [];
  try {
    const saved = localStorage.getItem(getHistoryKey());
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveHistory(results: QuizResult[]) {
  localStorage.setItem(getHistoryKey(), JSON.stringify(results));
}

interface HistoryStore {
  results: QuizResult[];
  addResult: (result: QuizResult) => void;
  clearHistory: () => void;
  reloadHistory: () => void;
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

  reloadHistory: () => {
    set({ results: loadHistory() });
  },
}));
