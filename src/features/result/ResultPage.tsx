import { useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import { PageHeader } from "@/components/molecules/PageHeader";
import { ScoreText } from "@/components/atoms/ScoreText";
import { StatBox } from "@/components/molecules/StatBox";
import { LectureStatRow } from "@/components/molecules/LectureStatRow";
import { Button } from "@/components/atoms/Button";
import { lectureOrder, lectureNames } from "@/constants/lectures";
import { formatTime, getScoreColor, getBarColor } from "@/lib/utils";

export function ResultPage() {
  const { questions, answers, level, totalElapsedTime, questionTimes, setPage, resetQuiz } = useQuizStore();
  const [showReview, setShowReview] = useState(false);

  const totalQuestions = questions.length;
  const correctCount = questions.filter(
    (q, i) => answers[i] === q.correctAnswer
  ).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

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

  const weakAreas = lectureStats.filter((s) => s.percentage < 60);

  if (showReview) {
    return (
      <div className="min-h-svh bg-background">
        <PageHeader
          title="Review Answers"
          right={
            <button
              onClick={() => setShowReview(false)}
              className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              กลับ
            </button>
          }
        />
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={i} className={`p-4 rounded-xl border-2 ${isCorrect ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded ${isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {isCorrect ? "\u2713" : "\u2717"}
                  </span>
                  <span className="text-sm font-medium">{i + 1}. {q.question}</span>
                </div>
                <div className="ml-7 space-y-1 text-sm">
                  {q.choices.map((c) => (
                    <div
                      key={c.key}
                      className={`${
                        c.key === q.correctAnswer ? "text-green-700 dark:text-green-400 font-medium" :
                        c.key === userAnswer && c.key !== q.correctAnswer ? "text-red-500 dark:text-red-400 line-through" :
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
          <ScoreText percentage={percentage} className="text-6xl font-bold mb-2 block" />
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
            <StatBox value={formatTime(totalElapsedTime)} label="เวลารวม" />
            <StatBox value={`${avgTimePerQuestion.toFixed(1)}s`} label="เฉลี่ยต่อข้อ" />
            {fastest && (
              <StatBox
                value={`${fastest.time.toFixed(1)}s`}
                label={`เร็วสุด (ข้อ ${fastest.index + 1})`}
                valueClassName="text-green-600 dark:text-green-400"
              />
            )}
            {slowest && (
              <StatBox
                value={`${slowest.time.toFixed(1)}s`}
                label={`ช้าสุด (ข้อ ${slowest.index + 1})`}
                valueClassName="text-red-600 dark:text-red-400"
              />
            )}
          </div>
        </div>

        {/* Per-lecture breakdown */}
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-sm mb-3">คะแนนแต่ละบทเรียน</h3>
          <div className="space-y-3">
            {lectureStats.map((s) => (
              <LectureStatRow
                key={s.lecture}
                name={s.name}
                correct={s.correct}
                total={s.total}
                avgTime={s.avgTime}
              />
            ))}
          </div>
        </div>

        {/* Best & Worst */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {bestLecture && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">เก่งที่สุด</div>
              <div className="text-xs font-bold text-green-800 dark:text-green-300">{bestLecture.name}</div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{bestLecture.percentage}%</div>
            </div>
          )}
          {worstLecture && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">ต้องปรับปรุง</div>
              <div className="text-xs font-bold text-red-800 dark:text-red-300">{worstLecture.name}</div>
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{worstLecture.percentage}%</div>
            </div>
          )}
        </div>

        {/* Weak areas suggestion */}
        {weakAreas.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300 mb-2">แนะนำให้ทบทวน</h3>
            <ul className="space-y-1">
              {weakAreas.map((w) => (
                <li key={w.lecture} className="text-xs text-amber-700 dark:text-amber-400">
                  • {w.name} — ได้ {w.percentage}% (ต่ำกว่า 60%)
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
              หัวข้อที่ใช้เวลานาน อาจเป็นจุดที่ยังไม่มั่นใจ ลองทบทวนเนื้อหาและทำซ้ำอีกครั้ง
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="primary" onClick={() => setShowReview(true)}>
            ดูเฉลยทั้งหมด
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (level) {
                resetQuiz();
                useQuizStore.getState().setPage("quiz");
              }
            }}
          >
            ทำซ้ำระดับเดิม
          </Button>
          <Button variant="ghost" onClick={() => setPage("start")}>
            เปลี่ยนระดับ
          </Button>
        </div>
      </div>
    </div>
  );
}
