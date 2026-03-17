export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateShuffledChoices(questionCount: number): Record<number, string[]> {
  const result: Record<number, string[]> = {};
  for (let i = 0; i < questionCount; i++) {
    result[i] = shuffleArray(["A", "B", "C", "D"]);
  }
  return result;
}
