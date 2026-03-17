import { cn } from "@/lib/utils";
import { getScoreColor } from "@/lib/utils";

interface ScoreTextProps {
  percentage: number;
  className?: string;
  children?: React.ReactNode;
}

export function ScoreText({ percentage, className, children }: ScoreTextProps) {
  return (
    <span className={cn(getScoreColor(percentage), className)}>
      {children ?? `${percentage}%`}
    </span>
  );
}
