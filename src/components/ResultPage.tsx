import { useState } from "react";
import { useQuizStore } from "../store/quizStore";
import { formatTime } from "../lib/utils";

const lectureNames: Record<string, string> = {
  "Lec8-Ethernet": "Lec 8 · Ethernet & Data Link",
  "Lec9A-NetworkLayer": "Lec 9A · Network Layer & IPv4",
  "Lec9B-Subnetting": "Lec 9B · Subnetting & VLSM",
  "Lec10-VLAN": "Lec 10 · VLAN, DHCP & IPv6",
  "Lec11-Routing": "Lec 11 · Routing",
  "Lec12-Transport": "Lec 12 · Transport & App Layer",
};

const lectureOrder = [
  "Lec8-Ethernet",
  "Lec9A-NetworkLayer",
  "Lec9B-Subnetting",
  "Lec10-VLAN",
  "Lec11-Routing",
  "Lec12-Transport",
];

export function ResultPage() {
  const { questions, answers, level, totalElapsedTime, questionTimes, setPage, setLevel, resetQuiz } = useQuizStore();
  const [showReview, setShowReview] = useState(false);

  const totalQuestions = questions.length;
  const correctCount = questions.filter(
    (q, i) => answers[i] === q.correctAnswer
  ).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Per-lecture stats
  const lectureStats = lectureOrder.map((lecKey) => {
    const indices = questions
      .map((q, i) => (q.lecture === lecKey ? i : -1))
      .filter((i) => i !== -1);
    const correct = indices.filter((i) => answers[i] === questions[i].correctAnswer).length;
    const total = indices.length;
    const avgTime = indices.length > 0
      ? indices.reduce((sum, i) => sum + (questionTimes[i] || 0), 0) / indices.length
      : 0;
    return {
      lecture: lecKey,
      name: lectureNames[lecKey] || lecKey,
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
      avgTime,
    };
  }).filter(s => s.total > 0);

  const bestLecture = lectureStats.reduce((a, b) => (a.percentage >= b.percentage ? a : b), lectureStats[0]);
  const worstLecture = lectureStats.reduce((a, b) => (a.percentage <= b.percentage ? a : b), lectureStats[0]);

  // Time stats
  const avgTimePerQuestion = totalQuestions > 0 ? totalElapsedTime / totalQuestions : 0;
  const timeEntries = Object.entries(questionTimes).map(([idx, time]) => ({
    index: Number(idx),
    time,
  }));
  const fastest = timeEntries.length > 0
    ? timeEntries.reduce((a, b) => (a.time < b.time ? a : b))
    : null;
  const slowest = timeEntries.length > 0
    ? timeEntries.reduce((a, b) => (a.time > b.time ? a : b))
    : null;

  // Weak areas
  const weakAreas = lectureStats.filter((s) => s.percentage < 60);

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getBarColor = (pct: number) => {
    if (pct >= 80) return "bg-green-500";
    if (pct >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (showReview) {
    return (
      <div className="min-h-svh bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <h3 className="font-bold">Review Answers</h3>
            <button
              onClick={() => setShowReview(false)}
              className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              กลับ
            </button>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={i} className={`p-4 rounded-xl border-2 ${isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded ${isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {isCorrect ? "✓" : "✗"}
                  </span>
                  <span className="text-sm font-medium">{i + 1}. {q.question}</span>
                </div>
                <div className="ml-7 space-y-1 text-sm">
                  {q.choices.map((c) => (
                    <div
                      key={c.key}
                      className={`${
                        c.key === q.correctAnswer ? "text-green-700 font-medium" :
                        c.key === userAnswer && c.key !== q.correctAnswer ? "text-red-500 line-through" :
                        "text-muted-foreground"
                      }`}
                    >
                      {c.key}. {c.text}
                    </div>
                  ))}
                </div>
                <p className="ml-7 mt-2 text-xs text-muted-foreground">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Score */}
        <div className="text-center mb-8">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
            {percentage}%
          </div>
          <div className="text-xl font-semibold text-foreground mb-1">
            {correctCount} / {totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground">
            {percentage >= 80 ? "ยอดเยี่ยม!" : percentage >= 60 ? "ผ่านเกณฑ์" : "ต้องทบทวนเพิ่มเติม"}
          </div>
        </div>

        {/* Time Stats */}
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-sm mb-3">สถิติเวลา</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold font-mono">{formatTime(totalElapsedTime)}</div>
              <div className="text-xs text-muted-foreground">เวลารวม</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold font-mono">{avgTimePerQuestion.toFixed(1)}s</div>
              <div className="text-xs text-muted-foreground">เฉลี่ยต่อข้อ</div>
            </div>
            {fastest && (
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold font-mono text-green-600">{fastest.time.toFixed(1)}s</div>
                <div className="text-xs text-muted-foreground">เร็วสุด (ข้อ {fastest.index + 1})</div>
              </div>
            )}
            {slowest && (
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold font-mono text-red-600">{slowest.time.toFixed(1)}s</div>
                <div className="text-xs text-muted-foreground">ช้าสุด (ข้อ {slowest.index + 1})</div>
              </div>
            )}
          </div>
        </div>

        {/* Per-lecture breakdown */}
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-sm mb-3">คะแนนแต่ละบทเรียน</h3>
          <div className="space-y-3">
            {lectureStats.map((s) => (
              <div key={s.lecture}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground">{s.name}</span>
                  <span className={`text-xs font-bold ${getScoreColor(s.percentage)}`}>
                    {s.correct}/{s.total} ({s.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getBarColor(s.percentage)}`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  เวลาเฉลี่ย: {s.avgTime.toFixed(1)}s/ข้อ
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best & Worst */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {bestLecture && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <div className="text-xs text-green-600 font-medium mb-1">เก่งที่สุด</div>
              <div className="text-xs font-bold text-green-800">{bestLecture.name}</div>
              <div className="text-lg font-bold text-green-600">{bestLecture.percentage}%</div>
            </div>
          )}
          {worstLecture && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <div className="text-xs text-red-600 font-medium mb-1">ต้องปรับปรุง</div>
              <div className="text-xs font-bold text-red-800">{worstLecture.name}</div>
              <div className="text-lg font-bold text-red-600">{worstLecture.percentage}%</div>
            </div>
          )}
        </div>

        {/* Weak areas suggestion */}
        {weakAreas.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-sm text-amber-800 mb-2">แนะนำให้ทบทวน</h3>
            <ul className="space-y-1">
              {weakAreas.map((w) => (
                <li key={w.lecture} className="text-xs text-amber-700">
                  • {w.name} — ได้ {w.percentage}% (ต่ำกว่า 60%)
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-600 mt-2">
              หัวข้อที่ใช้เวลานาน อาจเป็นจุดที่ยังไม่มั่นใจ ลองทบทวนเนื้อหาและทำซ้ำอีกครั้ง
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => setShowReview(true)}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            ดูเฉลยทั้งหมด
          </button>
          <button
            onClick={() => {
              if (level) {
                resetQuiz();
                useQuizStore.getState().setPage("quiz");
              }
            }}
            className="w-full py-3 bg-secondary text-secondary-foreground font-medium rounded-xl text-sm border border-border hover:bg-accent transition-all"
          >
            ทำซ้ำระดับเดิม
          </button>
          <button
            onClick={() => setPage("start")}
            className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            เปลี่ยนระดับ
          </button>
        </div>
      </div>
    </div>
  );
}
