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
  if (question.type === "multiple-choice") {
    const userKeys = answer.split(",").sort();
    const correctKeys = question.correctAnswer.split(",").sort();
    return (
      userKeys.length === correctKeys.length &&
      userKeys.every((k, i) => k === correctKeys[i])
    );
  }
  return answer === question.correctAnswer;
}
