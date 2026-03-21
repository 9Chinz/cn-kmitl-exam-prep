export interface Choice {
  key: string;
  text: string;
}

export type QuestionType = "choice" | "fill-blank" | "multiple-choice";

export interface FillBlankField {
  label: string;
  correctAnswer: string;
  explanation: string;
}

export interface Question {
  id: number;
  type?: QuestionType;
  lecture: string;
  question: string;
  choices?: Choice[];
  correctAnswer: string;
  correctAnswers?: string[];
  explanation: string;
  code?: string;
  blanks?: FillBlankField[];
}

export type Level = "easy" | "normal" | "hard" | "random"
  | "guideline-easy" | "guideline-normal" | "guideline-hard" | "guideline-random"
  | "practice-easy" | "practice-normal" | "practice-hard"
  | "cloud-module-2" | "cloud-module-3" | "cloud-module-4" | "cloud-module-5"
  | "cloud-module-6" | "cloud-module-7" | "cloud-module-8"
  | "cloud-module-10" | "cloud-module-11" | "cloud-module-12"
  | "cloud-module-13" | "cloud-module-14";
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
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
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
