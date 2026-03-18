import { Input } from "@/components/atoms/Input";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

interface FillBlankFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  submitted: boolean;
  isCorrect?: boolean;
  correctAnswer?: string;
  explanation?: string;
  disabled?: boolean;
}

export function FillBlankField({
  label,
  value,
  onChange,
  submitted,
  isCorrect,
  correctAnswer,
  explanation,
  disabled,
}: FillBlankFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Badge
          className={cn(
            "shrink-0 text-xs font-bold px-2 py-0.5 rounded text-white",
            submitted
              ? isCorrect
                ? "bg-green-500"
                : "bg-red-500"
              : "bg-primary",
          )}
        >
          {label}
          {submitted && (isCorrect ? " ✓" : " ✗")}
        </Badge>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || submitted}
          placeholder={`Fill blank ${label}`}
          error={submitted && !isCorrect}
          className={cn(
            "flex-1",
            submitted && isCorrect && "border-green-500 bg-green-500/5",
            submitted && !isCorrect && "border-red-500 bg-red-500/5",
          )}
        />
      </div>
      {submitted && !isCorrect && correctAnswer && (
        <div className="ml-9 text-xs text-red-600 dark:text-red-400">
          Correct: <span className="font-mono font-bold">{correctAnswer}</span>
        </div>
      )}
      {submitted && explanation && (
        <div className="ml-9 text-xs text-muted-foreground">{explanation}</div>
      )}
    </div>
  );
}
