import { create } from "zustand";
import type { Question, Level, Page, Checkpoint, QuizResult } from "../types/quiz";
import { generateShuffledChoices, shuffleArray } from "../lib/shuffle";
import { useHistoryStore } from "./historyStore";

import rawEasy from "../data/easy.json";
import rawNormal from "../data/normal.json";
import rawHard from "../data/hard.json";
import rawGuidelineEasy from "../data/guideline-easy.json";
import rawGuidelineNormal from "../data/guideline-normal.json";
import rawGuidelineHard from "../data/guideline-hard.json";

// Assign globally unique IDs
const easyQuestions = (rawEasy as Question[]).map((q) => ({ ...q, id: q.id }));
const normalQuestions = (rawNormal as Question[]).map((q) => ({ ...q, id: q.id + 100 }));
const hardQuestions = (rawHard as Question[]).map((q) => ({ ...q, id: q.id + 200 }));
const guidelineEasyQuestions = (rawGuidelineEasy as Question[]).map((q) => ({ ...q, id: q.id + 300 }));
const guidelineNormalQuestions = (rawGuidelineNormal as Question[]).map((q) => ({ ...q, id: q.id + 400 }));
const guidelineHardQuestions = (rawGuidelineHard as Question[]).map((q) => ({ ...q, id: q.id + 500 }));

const allQuestions = [
  ...easyQuestions, ...normalQuestions, ...hardQuestions,
  ...guidelineEasyQuestions, ...guidelineNormalQuestions, ...guidelineHardQuestions,
];

type DirectLevel = Exclude<Level, "random" | "guideline-random">;
const questionsMap: Record<DirectLevel, Question[]> = {
  easy: easyQuestions,
  normal: normalQuestions,
  hard: hardQuestions,
  "guideline-easy": guidelineEasyQuestions,
  "guideline-normal": guidelineNormalQuestions,
  "guideline-hard": guidelineHardQuestions,
};

function buildQuestions(level: Level): Question[] {
  if (level === "random") {
    const pick20 = (qs: Question[]) => shuffleArray(qs).slice(0, 20);
    return shuffleArray([
      ...pick20(easyQuestions),
      ...pick20(normalQuestions),
      ...pick20(hardQuestions),
    ]);
  }
  if (level === "guideline-random") {
    const pick20 = (qs: Question[]) => shuffleArray(qs).slice(0, 20);
    return shuffleArray([
      ...pick20(guidelineEasyQuestions),
      ...pick20(guidelineNormalQuestions),
      ...pick20(guidelineHardQuestions),
    ]);
  }
  return shuffleArray([...questionsMap[level]]);
}

const CHECKPOINT_KEY = (level: Level) => `cn-quiz-checkpoint-${level}`;

interface QuizStore {
  page: Page;
  level: Level | null;
  username: string;
  currentIndex: number;
  answers: Record<number, string>;
  shuffledChoices: Record<number, string[]>;
  questions: Question[];
  questionStartTime: number | null;
  questionTimes: Record<number, number>;
  totalElapsedTime: number;
  showLevelModal: boolean;
  pendingLevel: Level | null;

  setPage: (page: Page) => void;
  openLevelModal: () => void;
  closeLevelModal: () => void;
  selectLevel: (level: Level) => void;
  startQuiz: (username: string) => void;
  cancelNameInput: () => void;
  answerQuestion: (selectedKey: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  checkForCheckpoint: () => Level | null;
  resumeFromCheckpoint: (level: Level) => void;
}

function buildCheckpoint(state: Pick<QuizStore, "level" | "username" | "currentIndex" | "answers" | "shuffledChoices" | "questionTimes" | "totalElapsedTime" | "questions">): Checkpoint | null {
  if (!state.level) return null;
  return {
    level: state.level,
    username: state.username,
    currentIndex: state.currentIndex,
    answers: state.answers,
    shuffledChoices: state.shuffledChoices,
    questionTimes: state.questionTimes,
    questionIds: state.questions.map((q) => q.id),
    totalElapsedTime: state.totalElapsedTime,
    timestamp: Date.now(),
  };
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  page: "start",
  level: null,
  username: "",
  currentIndex: 0,
  answers: {},
  shuffledChoices: {},
  questions: [],
  questionStartTime: null,
  questionTimes: {},
  totalElapsedTime: 0,
  showLevelModal: false,
  pendingLevel: null,

  setPage: (page) => set({ page }),
  openLevelModal: () => set({ showLevelModal: true }),
  closeLevelModal: () => set({ showLevelModal: false, pendingLevel: null }),

  selectLevel: (level) => {
    set({ pendingLevel: level, showLevelModal: false });
  },

  startQuiz: (username) => {
    const { pendingLevel } = get();
    if (!pendingLevel) return;
    const questions = buildQuestions(pendingLevel);
    const shuffled = generateShuffledChoices(questions.length);
    localStorage.setItem("cn-quiz-last-name", username);
    set({
      level: pendingLevel,
      username,
      questions,
      shuffledChoices: shuffled,
      currentIndex: 0,
      answers: {},
      questionTimes: {},
      totalElapsedTime: 0,
      questionStartTime: Date.now(),
      page: "quiz",
      pendingLevel: null,
    });
  },

  cancelNameInput: () => set({ pendingLevel: null }),

  answerQuestion: (selectedKey) => {
    const { currentIndex, answers, questionStartTime, questionTimes, totalElapsedTime, level, shuffledChoices, questions, username } = get();
    if (answers[currentIndex] !== undefined) return;

    const now = Date.now();
    const timeSpent = questionStartTime ? (now - questionStartTime) / 1000 : 0;
    const newAnswers = { ...answers, [currentIndex]: selectedKey };
    const newQuestionTimes = { ...questionTimes, [currentIndex]: timeSpent };
    const newTotal = totalElapsedTime + timeSpent;

    set({
      answers: newAnswers,
      questionTimes: newQuestionTimes,
      totalElapsedTime: newTotal,
    });

    if (level) {
      const cp = buildCheckpoint({ level, username, currentIndex, answers: newAnswers, shuffledChoices, questionTimes: newQuestionTimes, totalElapsedTime: newTotal, questions });
      if (cp) localStorage.setItem(CHECKPOINT_KEY(level), JSON.stringify(cp));
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions, answers, level, username, totalElapsedTime, questionTimes } = get();
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      set({ currentIndex: newIndex, questionStartTime: Date.now() });

      if (level) {
        const state = get();
        const cp = buildCheckpoint(state);
        if (cp) localStorage.setItem(CHECKPOINT_KEY(level), JSON.stringify(cp));
      }
    } else if (Object.keys(answers).length === questions.length) {
      // Quiz complete — save result
      if (level) {
        localStorage.removeItem(CHECKPOINT_KEY(level));

        const lectureBreakdown: Record<string, { correct: number; total: number }> = {};
        questions.forEach((q, i) => {
          if (!lectureBreakdown[q.lecture]) {
            lectureBreakdown[q.lecture] = { correct: 0, total: 0 };
          }
          lectureBreakdown[q.lecture].total++;
          if (answers[i] === q.correctAnswer) {
            lectureBreakdown[q.lecture].correct++;
          }
        });

        const score = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
        const result: QuizResult = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          username: username || "Anonymous",
          level,
          score,
          total: questions.length,
          percentage: Math.round((score / questions.length) * 100),
          totalTime: totalElapsedTime,
          lectureBreakdown,
          date: new Date().toISOString(),
        };
        useHistoryStore.getState().addResult(result);
      }
      set({ page: "result" });
    }
  },

  resetQuiz: () => {
    const { level } = get();
    if (!level) return;
    const questions = buildQuestions(level);
    const shuffled = generateShuffledChoices(questions.length);
    localStorage.removeItem(CHECKPOINT_KEY(level));
    set({
      questions,
      currentIndex: 0,
      answers: {},
      shuffledChoices: shuffled,
      questionTimes: {},
      totalElapsedTime: 0,
      questionStartTime: Date.now(),
    });
  },

  checkForCheckpoint: () => {
    const levels: Level[] = ["easy", "normal", "hard", "random", "guideline-easy", "guideline-normal", "guideline-hard", "guideline-random"];
    for (const level of levels) {
      const saved = localStorage.getItem(CHECKPOINT_KEY(level));
      if (saved) {
        try {
          const checkpoint: Checkpoint = JSON.parse(saved);
          if (checkpoint.questionIds && Object.keys(checkpoint.answers).length < checkpoint.questionIds.length) {
            return level;
          }
        } catch {
          localStorage.removeItem(CHECKPOINT_KEY(level));
        }
      }
    }
    return null;
  },

  resumeFromCheckpoint: (level) => {
    const saved = localStorage.getItem(CHECKPOINT_KEY(level));
    if (!saved) return;

    try {
      const checkpoint: Checkpoint = JSON.parse(saved);

      // Rebuild question order from saved IDs
      const idMap = new Map(allQuestions.map((q) => [q.id, q]));
      let questions: Question[];
      if (checkpoint.questionIds) {
        questions = checkpoint.questionIds.map((id) => idMap.get(id)).filter(Boolean) as Question[];
      } else {
        // Legacy checkpoint without questionIds
        questions = (level === "random" || level === "guideline-random") ? buildQuestions(level) : [...questionsMap[level]];
      }

      const resumeIndex = checkpoint.answers[checkpoint.currentIndex] !== undefined
        ? Math.min(checkpoint.currentIndex + 1, questions.length - 1)
        : checkpoint.currentIndex;

      set({
        level,
        username: checkpoint.username || "",
        questions,
        currentIndex: resumeIndex,
        answers: checkpoint.answers,
        shuffledChoices: checkpoint.shuffledChoices,
        questionTimes: checkpoint.questionTimes,
        totalElapsedTime: checkpoint.totalElapsedTime,
        questionStartTime: Date.now(),
        page: "quiz",
      });
    } catch {
      localStorage.removeItem(CHECKPOINT_KEY(level));
    }
  },
}));
