import { create } from "zustand";
import type { Question, Level, Page, Checkpoint } from "../types/quiz";
import { generateShuffledChoices } from "../lib/shuffle";

import easyQuestions from "../data/easy.json";
import normalQuestions from "../data/normal.json";
import hardQuestions from "../data/hard.json";

const questionsMap: Record<Level, Question[]> = {
  easy: easyQuestions as Question[],
  normal: normalQuestions as Question[],
  hard: hardQuestions as Question[],
};

const CHECKPOINT_KEY = (level: Level) => `cn-quiz-checkpoint-${level}`;

interface QuizStore {
  page: Page;
  level: Level | null;
  currentIndex: number;
  answers: Record<number, string>;
  shuffledChoices: Record<number, string[]>;
  questions: Question[];
  questionStartTime: number | null;
  questionTimes: Record<number, number>;
  totalElapsedTime: number;
  showLevelModal: boolean;

  setPage: (page: Page) => void;
  openLevelModal: () => void;
  closeLevelModal: () => void;
  setLevel: (level: Level) => void;
  answerQuestion: (selectedKey: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  checkForCheckpoint: () => Level | null;
  resumeFromCheckpoint: (level: Level) => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  page: "start",
  level: null,
  currentIndex: 0,
  answers: {},
  shuffledChoices: {},
  questions: [],
  questionStartTime: null,
  questionTimes: {},
  totalElapsedTime: 0,
  showLevelModal: false,

  setPage: (page) => set({ page }),

  openLevelModal: () => set({ showLevelModal: true }),

  closeLevelModal: () => set({ showLevelModal: false }),

  setLevel: (level) => {
    const questions = questionsMap[level];
    const shuffled = generateShuffledChoices(questions.length);
    set({
      level,
      questions,
      shuffledChoices: shuffled,
      currentIndex: 0,
      answers: {},
      questionTimes: {},
      totalElapsedTime: 0,
      questionStartTime: Date.now(),
      page: "quiz",
      showLevelModal: false,
    });
  },

  answerQuestion: (selectedKey) => {
    const { currentIndex, answers, questionStartTime, questionTimes, totalElapsedTime, level, shuffledChoices } = get();
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
      const checkpoint: Checkpoint = {
        level,
        currentIndex,
        answers: newAnswers,
        shuffledChoices,
        questionTimes: newQuestionTimes,
        totalElapsedTime: newTotal,
        timestamp: now,
      };
      localStorage.setItem(CHECKPOINT_KEY(level), JSON.stringify(checkpoint));
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions, answers, level } = get();
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      set({ currentIndex: newIndex, questionStartTime: Date.now() });

      if (level) {
        const state = get();
        const checkpoint: Checkpoint = {
          level,
          currentIndex: newIndex,
          answers: state.answers,
          shuffledChoices: state.shuffledChoices,
          questionTimes: state.questionTimes,
          totalElapsedTime: state.totalElapsedTime,
          timestamp: Date.now(),
        };
        localStorage.setItem(CHECKPOINT_KEY(level), JSON.stringify(checkpoint));
      }
    } else if (Object.keys(answers).length === questions.length) {
      if (level) {
        localStorage.removeItem(CHECKPOINT_KEY(level));
      }
      set({ page: "result" });
    }
  },

  resetQuiz: () => {
    const { level, questions } = get();
    if (!level) return;
    const shuffled = generateShuffledChoices(questions.length);
    localStorage.removeItem(CHECKPOINT_KEY(level));
    set({
      currentIndex: 0,
      answers: {},
      shuffledChoices: shuffled,
      questionTimes: {},
      totalElapsedTime: 0,
      questionStartTime: Date.now(),
    });
  },

  checkForCheckpoint: () => {
    const levels: Level[] = ["easy", "normal", "hard"];
    for (const level of levels) {
      const saved = localStorage.getItem(CHECKPOINT_KEY(level));
      if (saved) {
        try {
          const checkpoint: Checkpoint = JSON.parse(saved);
          if (Object.keys(checkpoint.answers).length < questionsMap[level].length) {
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
      const questions = questionsMap[level];

      const resumeIndex = checkpoint.answers[checkpoint.currentIndex] !== undefined
        ? Math.min(checkpoint.currentIndex + 1, questions.length - 1)
        : checkpoint.currentIndex;

      set({
        level,
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
