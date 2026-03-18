import type { Question } from "@/types/quiz";

export function isAnswerCorrect(question: Question, answer: string): boolean {
  if (question.type === "fill-blank" && question.blanks) {
    try {
      const filled = JSON.parse(answer) as Record<string, string>;
      return question.blanks.every(
        (b) => filled[b.label]?.trim() === b.correctAnswer.trim()
      );
    } catch {
      return false;
    }
  }
  return answer === question.correctAnswer;
}
