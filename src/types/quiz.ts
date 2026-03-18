export interface Choice {
  key: string;
  text: string;
}

export type QuestionType = "choice" | "fill-blank";

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
  explanation: string;
  code?: string;
  blanks?: FillBlankField[];
}

export type Level = "easy" | "normal" | "hard" | "random"
  | "guideline-easy" | "guideline-normal" | "guideline-hard" | "guideline-random"
  | "practice-easy" | "practice-normal" | "practice-hard";
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
