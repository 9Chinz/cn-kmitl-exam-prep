import type { Question } from "@/types/quiz";

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getChoiceKeys(count: number): string[] {
  return Array.from({ length: count }, (_, i) => String.fromCharCode(65 + i));
}

export function generateShuffledChoices(questions: Question[], shuffle = true): Record<number, string[]> {
  const result: Record<number, string[]> = {};
  for (let i = 0; i < questions.length; i++) {
    const choiceCount = questions[i].choices?.length ?? 4;
    const keys = getChoiceKeys(choiceCount);
    result[i] = shuffle ? shuffleArray(keys) : [...keys];
  }
  return result;
}
