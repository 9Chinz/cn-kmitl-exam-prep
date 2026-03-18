import { useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import { useHistoryStore } from "@/store/historyStore";
import { useSubjectStore } from "@/store/subjectStore";
import { PageHeader } from "@/components/molecules/PageHeader";
import { LevelBadge } from "@/components/molecules/LevelBadge";
import { ScoreText } from "@/components/atoms/ScoreText";
import { LectureStatRow } from "@/components/molecules/LectureStatRow";
import { formatTime } from "@/lib/utils";
import type { QuizResult } from "@/types/quiz";

const baseFilterOptions: { value: string; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" }) +
    " " + d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

function ResultDetail({ result, onBack }: { result: QuizResult; onBack: () => void }) {
  const config = useSubjectStore((s) => s.getConfig());
  const lectureNames = config?.lectureNames ?? {};

  const breakdown = Object.entries(result.lectureBreakdown).map(([key, val]) => ({
    key,
    name: lectureNames[key] || key,
    ...val,
    percentage: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0,
  }));

  return (
    <div className="min-h-svh bg-background">
      <PageHeader title={result.username} onBack={onBack} />

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mb-3">
            <LevelBadge level={result.level} size="md" />
          </div>
          <ScoreText percentage={result.percentage} className="text-5xl font-bold mb-1 block" />
          <div className="text-lg font-semibold text-foreground">{result.score} / {result.total}</div>
          <div className="text-xs text-muted-foreground mt-1">{formatDate(result.date)}</div>
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-card border border-border rounded-xl">
            <div className="text-lg font-bold font-mono">{formatTime(result.totalTime)}</div>
            <div className="text-xs text-muted-foreground">เวลารวม</div>
          </div>
          <div className="text-center p-3 bg-card border border-border rounded-xl">
            <div className="text-lg font-bold font-mono">{result.total > 0 ? (result.totalTime / result.total).toFixed(1) : 0}s</div>
            <div className="text-xs text-muted-foreground">เฉลี่ยต่อข้อ</div>
          </div>
        </div>

        {/* Lecture breakdown */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="font-bold text-sm mb-3">คะแนนแต่ละบทเรียน</h4>
          <div className="space-y-3">
            {breakdown.map((s) => (
              <LectureStatRow
                key={s.key}
                name={s.name}
                correct={s.correct}
                total={s.total}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsPage() {
  const setPage = useQuizStore((s) => s.setPage);
  const config = useSubjectStore((s) => s.getConfig());
  const { results } = useHistoryStore();
  const [filter, setFilter] = useState("all");
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);

  const filterOptions = [
    ...baseFilterOptions,
    ...(config?.levelGroups ?? []).flatMap((g) =>
      g.levels.map((l) => ({ value: l.level, label: l.label }))
    ),
  ];

  if (selectedResult) {
    return <ResultDetail result={selectedResult} onBack={() => setSelectedResult(null)} />;
  }

  const filtered = filter === "all" ? results : results.filter((r) => r.level === filter);

  return (
    <div className="min-h-svh bg-background">
      <PageHeader title="สถิติผู้ทำข้อสอบ" onBack={() => setPage("start")} />

      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Results list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-muted-foreground text-sm">ยังไม่มีข้อมูลสถิติ</p>
            <p className="text-muted-foreground text-xs mt-1">ทำข้อสอบให้เสร็จเพื่อบันทึกผล</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedResult(r)}
                className="w-full text-left p-3.5 bg-card border border-border rounded-xl hover:bg-accent/50 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {r.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium truncate">{r.username}</span>
                    <LevelBadge level={r.level} />
                  </div>
                  <div className="text-xs text-muted-foreground">{formatDate(r.date)}</div>
                </div>
                <div className="text-right shrink-0">
                  <ScoreText percentage={r.percentage} className="text-lg font-bold" />
                  <div className="text-[10px] text-muted-foreground">{r.score}/{r.total}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
