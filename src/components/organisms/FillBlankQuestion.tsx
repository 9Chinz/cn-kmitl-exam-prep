import { useState } from "react";
import { CodeBlock } from "@/components/atoms/CodeBlock";
import { Button } from "@/components/atoms/Button";
import { FillBlankField } from "@/components/molecules/FillBlankField";
import type { Question } from "@/types/quiz";

interface FillBlankQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  storedAnswer?: string;
}

export function FillBlankQuestion({
  question,
  onAnswer,
  isAnswered,
  storedAnswer,
}: FillBlankQuestionProps) {
  const blanks = question.blanks || [];
  const [fields, setFields] = useState<Record<string, string>>(() => {
    if (isAnswered && storedAnswer) {
      try {
        return JSON.parse(storedAnswer);
      } catch {
        return {};
      }
    }
    return Object.fromEntries(blanks.map((b) => [b.label, ""]));
  });

  const allFilled = blanks.every((b) => fields[b.label]?.trim());

  const handleSubmit = () => {
    if (!allFilled) return;
    onAnswer(JSON.stringify(fields));
  };

  const parsedAnswer: Record<string, string> | null = isAnswered && storedAnswer
    ? (() => { try { return JSON.parse(storedAnswer); } catch { return null; } })()
    : null;

  return (
    <div className="space-y-4">
      {question.code && <CodeBlock code={question.code} />}

      <div className="space-y-3">
        {blanks.map((blank) => {
          const fieldCorrect = parsedAnswer
            ? parsedAnswer[blank.label]?.trim() === blank.correctAnswer.trim()
            : undefined;

          return (
            <FillBlankField
              key={blank.label}
              label={blank.label}
              value={fields[blank.label] || ""}
              onChange={(val) =>
                setFields((prev) => ({ ...prev, [blank.label]: val }))
              }
              submitted={isAnswered}
              isCorrect={fieldCorrect}
              correctAnswer={blank.correctAnswer}
              explanation={blank.explanation}
              disabled={isAnswered}
            />
          );
        })}
      </div>

      {!isAnswered && (
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!allFilled}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit Answer
        </Button>
      )}

      {isAnswered && (
        <div className="p-3 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
