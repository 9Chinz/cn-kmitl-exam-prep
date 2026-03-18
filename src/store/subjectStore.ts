import { create } from "zustand";
import type { SubjectId, SubjectConfig } from "../types/subject";
import { subjects } from "../config/subjects";

const STORAGE_KEY = "quiz-app-subject";

function loadSubject(): SubjectId | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && saved in subjects) return saved as SubjectId;
  return null;
}

interface SubjectStore {
  subjectId: SubjectId | null;
  selectSubject: (id: SubjectId) => void;
  clearSubject: () => void;
  getConfig: () => SubjectConfig | null;
}

export const useSubjectStore = create<SubjectStore>((set, get) => ({
  subjectId: loadSubject(),

  selectSubject: (id) => {
    localStorage.setItem(STORAGE_KEY, id);
    set({ subjectId: id });
  },

  clearSubject: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ subjectId: null });
  },

  getConfig: () => {
    const { subjectId } = get();
    return subjectId ? subjects[subjectId] : null;
  },
}));
