import type { Question, Level } from "./quiz";

export type SubjectId = "cn" | "oop" | "cloud-architecture";

export interface SubjectLecture {
  id: string;
  key: string;
  title: string;
  color: string;
}

export interface LevelGroup {
  groupLabel: string;
  levels: { level: Level; label: string; desc: string; color: string }[];
}

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  lectures: SubjectLecture[];
  lectureNames: Record<string, string>;
  lectureOrder: string[];
  levelGroups: LevelGroup[];
  questions: Record<string, Question[]>;
  allQuestions: Question[];
  buildQuestions: (level: Level, shuffle: boolean) => Question[];
}
