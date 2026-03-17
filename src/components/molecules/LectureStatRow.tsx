import { getScoreColor, getBarColor } from "@/lib/utils";

interface LectureStatRowProps {
  name: string;
  correct: number;
  total: number;
  avgTime?: number;
}

export function LectureStatRow({ name, correct, total, avgTime }: LectureStatRowProps) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-foreground">{name}</span>
        <span className={`text-xs font-bold ${getScoreColor(pct)}`}>
          {correct}/{total} ({pct}%)
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getBarColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {avgTime !== undefined && (
        <div className="text-[10px] text-muted-foreground mt-0.5">
          เวลาเฉลี่ย: {avgTime.toFixed(1)}s/ข้อ
        </div>
      )}
    </div>
  );
}
