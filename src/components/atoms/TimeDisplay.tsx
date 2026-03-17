import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";

interface TimeDisplayProps {
  seconds: number;
  className?: string;
}

export function TimeDisplay({ seconds, className }: TimeDisplayProps) {
  return (
    <span className={cn("font-mono", className)}>
      {formatTime(seconds)}
    </span>
  );
}
