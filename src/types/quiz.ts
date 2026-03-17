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

export type Level = "easy" | "normal" | "hard";
export type Page = "start" | "quiz" | "result";

export interface Checkpoint {
  level: Level;
  currentIndex: number;
  answers: Record<number, string>;
  shuffledChoices: Record<number, string[]>;
  questionTimes: Record<number, number>;
  totalElapsedTime: number;
  timestamp: number;
}
