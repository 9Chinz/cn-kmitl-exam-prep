import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ExplanationBox } from "@/components/molecules/ExplanationBox";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/quiz";

interface MultipleChoiceQuestionProps {
  question: Question;
  choiceOrder: string[];
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  storedAnswer?: string;
}

function parseRequiredCount(questionText: string): number | null {
  const match = questionText.match(/Select (TWO|THREE|FOUR|FIVE|(\d+))/i);
  if (!match) return null;
  const word = match[1].toUpperCase();
  const map: Record<string, number> = { TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  return map[word] ?? (parseInt(match[2], 10) || null);
}

type ChoiceState = "default" | "selected" | "correct-selected" | "correct-missed" | "wrong-selected" | "dimmed";

const stateStyles: Record<ChoiceState, string> = {
  default: "bg-card border-border hover:border-primary/50 hover:bg-primary/5 active:scale-[0.99]",
  selected: "bg-primary/10 border-primary",
  "correct-selected": "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400",
  "correct-missed": "bg-green-500/5 border-green-500/50 text-green-700 dark:text-green-400",
  "wrong-selected": "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400",
  dimmed: "bg-card border-border opacity-50",
};

export function MultipleChoiceQuestion({
  question,
  choiceOrder,
  onAnswer,
  isAnswered,
  storedAnswer,
}: MultipleChoiceQuestionProps) {
  const [selected, setSelected] = useState<Set<string>>(() => {
    if (isAnswered && storedAnswer) {
      return new Set(storedAnswer.split(","));
    }
    return new Set();
  });

  const requiredCount = parseRequiredCount(question.question);
  const correctKeys = new Set(question.correctAnswer.split(","));

  const displayLabels = Array.from({ length: question.choices?.length ?? 0 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const toggleChoice = (originalKey: string) => {
    if (isAnswered) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(originalKey)) {
        next.delete(originalKey);
      } else {
        next.add(originalKey);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const answer = Array.from(selected).sort().join(",");
    onAnswer(answer);
  };

  const getChoiceState = (originalKey: string): ChoiceState => {
    if (!isAnswered) {
      return selected.has(originalKey) ? "selected" : "default";
    }
    const isCorrect = correctKeys.has(originalKey);
    const wasSelected = selected.has(originalKey);
    if (isCorrect && wasSelected) return "correct-selected";
    if (isCorrect && !wasSelected) return "correct-missed";
    if (!isCorrect && wasSelected) return "wrong-selected";
    return "dimmed";
  };

  const getChoiceIcon = (originalKey: string): string | null => {
    if (!isAnswered) return null;
    const isCorrect = correctKeys.has(originalKey);
    const wasSelected = selected.has(originalKey);
    if (isCorrect) return "\u2713";
    if (wasSelected && !isCorrect) return "\u2717";
    return null;
  };

  const isAllCorrect = isAnswered && Array.from(selected).sort().join(",") === Array.from(correctKeys).sort().join(",");

  return (
    <div>
      {requiredCount && !isAnswered && (
        <p className="text-xs text-muted-foreground mb-3">
          เลือก {requiredCount} คำตอบ ({selected.size}/{requiredCount})
        </p>
      )}

      <div className="space-y-2.5 mb-4">
        {displayLabels.map((label, displayIndex) => {
          const originalKey = choiceOrder[displayIndex];
          const choice = question.choices?.find((c) => c.key === originalKey);
          if (!choice) return null;

          const state = getChoiceState(originalKey);
          const icon = getChoiceIcon(originalKey);

          return (
            <button
              key={displayIndex}
              disabled={isAnswered}
              onClick={() => toggleChoice(originalKey)}
              className={cn(
                "w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3",
                stateStyles[state]
              )}
            >
              <span className="shrink-0 flex items-center justify-center pt-0.5">
                {isAnswered ? (
                  <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {icon || label}
                  </span>
                ) : (
                  <Checkbox
                    checked={selected.has(originalKey)}
                    onCheckedChange={() => toggleChoice(originalKey)}
                    className="pointer-events-none"
                  />
                )}
              </span>
              <span className="text-sm leading-relaxed pt-0.5">{choice.text}</span>
            </button>
          );
        })}
      </div>

      {!isAnswered && selected.size > 0 && (
        <Button
          variant="primary"
          onClick={handleSubmit}
          className="mb-4"
        >
          ส่งคำตอบ
        </Button>
      )}

      {isAnswered && (
        <ExplanationBox correct={isAllCorrect} text={question.explanation} />
      )}
    </div>
  );
}
