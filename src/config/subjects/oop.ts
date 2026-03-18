import type { Question, Level } from "@/types/quiz";
import type { SubjectConfig } from "@/types/subject";
import { shuffleArray } from "@/lib/shuffle";

import rawEasy from "@/data/oop/easy.json";
import rawNormal from "@/data/oop/normal.json";
import rawHard from "@/data/oop/hard.json";

const easyQuestions = (rawEasy as Question[]).map((q) => ({ ...q, id: q.id + 1000 }));
const normalQuestions = (rawNormal as Question[]).map((q) => ({ ...q, id: q.id + 1100 }));
const hardQuestions = (rawHard as Question[]).map((q) => ({ ...q, id: q.id + 1200 }));

const allQuestions = [
  ...easyQuestions, ...normalQuestions, ...hardQuestions,
];

const questions: Record<string, Question[]> = {
  easy: easyQuestions,
  normal: normalQuestions,
  hard: hardQuestions,
};

function buildQuestions(level: Level, shuffle: boolean): Question[] {
  const maybeShuffleArray = <T,>(arr: T[]) => shuffle ? shuffleArray(arr) : arr;

  if (level === "random") {
    const pick20 = (qs: Question[]) => shuffleArray(qs).slice(0, 20);
    return maybeShuffleArray([
      ...pick20(easyQuestions),
      ...pick20(normalQuestions),
      ...pick20(hardQuestions),
    ]);
  }
  if (questions[level]) {
    return maybeShuffleArray([...questions[level]]);
  }
  return [];
}

export const oopSubject: SubjectConfig = {
  id: "oop",
  name: "Object-Oriented Programming",
  code: "01076113",
  description: "180 questions across 3 difficulty levels",
  icon: "💻",
  color: "bg-violet-600",
  lectures: [
    { id: "Ch 2", key: "Ch2-Variables", title: "Variables, Data Types & Operators", color: "bg-blue-500" },
    { id: "Ch 4", key: "Ch4-Selection", title: "Selection (if/else, switch-case)", color: "bg-green-500" },
    { id: "Ch 5", key: "Ch5-Strings", title: "String & File I/O", color: "bg-orange-500" },
    { id: "Ch 6", key: "Ch6-Methods", title: "Methods & Overloading", color: "bg-purple-500" },
    { id: "Ch 7", key: "Ch7-Arrays", title: "Arrays & Sorting", color: "bg-red-500" },
    { id: "Ch 8", key: "Ch8-ClassObject", title: "Class & Object (OOP)", color: "bg-teal-500" },
  ],
  lectureNames: {
    "Ch2-Variables": "Ch 2 · Variables & Operators",
    "Ch4-Selection": "Ch 4 · Selection",
    "Ch5-Strings": "Ch 5 · String & File I/O",
    "Ch6-Methods": "Ch 6 · Methods",
    "Ch7-Arrays": "Ch 7 · Arrays & Sorting",
    "Ch8-ClassObject": "Ch 8 · Class & Object",
  },
  lectureOrder: [
    "Ch2-Variables",
    "Ch4-Selection",
    "Ch5-Strings",
    "Ch6-Methods",
    "Ch7-Arrays",
    "Ch8-ClassObject",
  ],
  levelGroups: [
    {
      groupLabel: "Difficulty Levels",
      levels: [
        { level: "easy", label: "Easy", desc: "คำถามพื้นฐาน นิยาม และโค้ดง่าย ๆ", color: "bg-green-500 hover:bg-green-600" },
        { level: "normal", label: "Normal", desc: "ทดสอบความเข้าใจและประยุกต์ใช้", color: "bg-yellow-500 hover:bg-yellow-600" },
        { level: "hard", label: "Hard", desc: "โจทย์ซับซ้อน edge case และวิเคราะห์", color: "bg-red-500 hover:bg-red-600" },
      ],
    },
  ],
  questions,
  allQuestions,
  buildQuestions,
};
