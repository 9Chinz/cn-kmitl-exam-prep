export interface Choice {
  key: string;
  text: string;
}

export interface Question {
  id: number;
  lecture: string;
  question: string;
  choices: Choice[];
  correctAnswer: string;
  explanation: string;
}

export type Level = "easy" | "normal" | "hard" | "random"
  | "guideline-easy" | "guideline-normal" | "guideline-hard" | "guideline-random";
export type Page = "start" | "quiz" | "result" | "stats";

export interface Checkpoint {
  level: Level;
  username: string;
  currentIndex: number;
  answers: Record<number, string>;
  shuffledChoices: Record<number, string[]>;
  questionTimes: Record<number, number>;
  questionIds: number[];
  totalElapsedTime: number;
  timestamp: number;
}

export interface QuizResult {
  id: string;
  username: string;
  level: Level;
  score: number;
  total: number;
  percentage: number;
  totalTime: number;
  lectureBreakdown: Record<string, { correct: number; total: number }>;
  date: string;
}
