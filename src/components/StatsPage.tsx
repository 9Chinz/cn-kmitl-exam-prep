import { useState } from "react";
import { useQuizStore } from "../store/quizStore";
import { useHistoryStore } from "../store/historyStore";
import { formatTime } from "../lib/utils";
import type { QuizResult, Level } from "../types/quiz";

const levelLabels: Record<string, string> = { easy: "Easy", normal: "Normal", hard: "Hard", random: "Random" };
const levelColors: Record<string, string> = {
  easy: "bg-green-500",
  normal: "bg-yellow-500",
  hard: "bg-red-500",
  random: "bg-purple-500",
};

const lectureNames: Record<string, string> = {
  "Lec8-Ethernet": "Lec 8 · Ethernet",
  "Lec9A-NetworkLayer": "Lec 9A · Network Layer",
  "Lec9B-Subnetting": "Lec 9B · Subnetting",
  "Lec10-VLAN": "Lec 10 · VLAN/DHCP/IPv6",
  "Lec11-Routing": "Lec 11 · Routing",
  "Lec12-Transport": "Lec 12 · Transport/App",
};

const filterOptions: { value: string; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "easy", label: "Easy" },
  { value: "normal", label: "Normal" },
  { value: "hard", label: "Hard" },
  { value: "random", label: "Random" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" }) +
    " " + d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

function getScoreColor(pct: number) {
  if (pct >= 80) return "text-green-600 dark:text-green-400";
  if (pct >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getBarColor(pct: number) {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function ResultDetail({ result, onBack }: { result: QuizResult; onBack: () => void }) {
  const breakdown = Object.entries(result.lectureBreakdown).map(([key, val]) => ({
    key,
    name: lectureNames[key] || key,
    ...val,
    percentage: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0,
  }));

  return (
    <div className="min-h-svh bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h3 className="font-bold text-sm">{result.username}</h3>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <span className={`inline-block px-3 py-1 rounded text-white text-xs font-bold mb-3 ${levelColors[result.level] || "bg-gray-500"}`}>
            {levelLabels[result.level] || result.level}
          </span>
          <div className={`text-5xl font-bold mb-1 ${getScoreColor(result.percentage)}`}>{result.percentage}%</div>
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
              <div key={s.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground">{s.name}</span>
                  <span className={`text-xs font-bold ${getScoreColor(s.percentage)}`}>
                    {s.correct}/{s.total} ({s.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getBarColor(s.percentage)}`} style={{ width: `${s.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsPage() {
  const setPage = useQuizStore((s) => s.setPage);
  const { results } = useHistoryStore();
  const [filter, setFilter] = useState("all");
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);

  if (selectedResult) {
    return <ResultDetail result={selectedResult} onBack={() => setSelectedResult(null)} />;
  }

  const filtered = filter === "all" ? results : results.filter((r) => r.level === filter);

  return (
    <div className="min-h-svh bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => setPage("start")} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h3 className="font-bold text-sm">สถิติผู้ทำข้อสอบ</h3>
        </div>
      </div>

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
                    <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${levelColors[r.level] || "bg-gray-500"}`}>
                      {levelLabels[r.level] || r.level}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{formatDate(r.date)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-lg font-bold ${getScoreColor(r.percentage)}`}>{r.percentage}%</div>
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
