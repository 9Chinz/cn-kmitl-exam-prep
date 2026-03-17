import { cn } from "@/lib/utils";

interface StatBoxProps {
  value: string;
  label: string;
  valueClassName?: string;
}

export function StatBox({ value, label, valueClassName }: StatBoxProps) {
  return (
    <div className="text-center p-2 bg-muted/50 rounded-lg">
      <div className={cn("text-lg font-bold font-mono", valueClassName)}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
