import { useState, useEffect, useCallback } from "react";
import { useQuizStore } from "../store/quizStore";
import { ResetDialog } from "./ResetDialog";
import { formatTime } from "../lib/utils";

const levelLabels = { easy: "Easy", normal: "Normal", hard: "Hard" };
const levelColors = {
  easy: "bg-green-500",
  normal: "bg-yellow-500",
  hard: "bg-red-500",
};

export function QuizPage() {
  const {
    level,
    currentIndex,
    questions,
    answers,
    shuffledChoices,
    totalElapsedTime,
    questionStartTime,
    answerQuestion,
    nextQuestion,
  } = useQuizStore();

  const [showReset, setShowReset] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentQuestionTime = questionStartTime
        ? (Date.now() - questionStartTime) / 1000
        : 0;
      const isAnswered = answers[currentIndex] !== undefined;
      setElapsed(totalElapsedTime + (isAnswered ? 0 : currentQuestionTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [totalElapsedTime, questionStartTime, answers, currentIndex]);

  const question = questions[currentIndex];
  if (!question || !level) return null;

  const selectedAnswer = answers[currentIndex];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const choiceOrder = shuffledChoices[currentIndex] || ["A", "B", "C", "D"];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  const getChoiceStyle = (key: string) => {
    if (!isAnswered) {
      return "bg-card border-border hover:border-primary/50 hover:bg-primary/5 active:scale-[0.99]";
    }
    if (key === question.correctAnswer) {
      return "bg-green-50 border-green-500 text-green-800";
    }
    if (key === selectedAnswer && key !== question.correctAnswer) {
      return "bg-red-50 border-red-500 text-red-800";
    }
    return "bg-card border-border opacity-50";
  };

  const getChoiceIcon = (key: string) => {
    if (!isAnswered) return null;
    if (key === question.correctAnswer) return "✓";
    if (key === selectedAnswer && key !== question.correctAnswer) return "✗";
    return null;
  };

  return (
    <div className="min-h-svh flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`${levelColors[level]} text-white text-xs font-bold px-2 py-0.5 rounded`}>
              {levelLabels[level]}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-muted-foreground">
              {formatTime(elapsed)}
            </span>
            <button
              onClick={() => setShowReset(true)}
              className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-lg mx-auto mt-2">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <div className="mb-1">
          <span className="text-xs text-muted-foreground">
            {question.lecture.replace("Lec8-Ethernet", "Lec 8 · Ethernet")
              .replace("Lec9A-NetworkLayer", "Lec 9A · Network Layer")
              .replace("Lec9B-Subnetting", "Lec 9B · Subnetting")
              .replace("Lec10-VLAN", "Lec 10 · VLAN/DHCP/IPv6")
              .replace("Lec11-Routing", "Lec 11 · Routing")
              .replace("Lec12-Transport", "Lec 12 · Transport/App Layer")}
          </span>
        </div>
        <h2 className="text-base font-semibold text-foreground mb-5 leading-relaxed">
          {currentIndex + 1}. {question.question}
        </h2>

        {/* Choices */}
        <div className="space-y-2.5 mb-6">
          {choiceOrder.map((key) => {
            const choice = question.choices.find((c) => c.key === key);
            if (!choice) return null;
            const icon = getChoiceIcon(key);
            return (
              <button
                key={key}
                disabled={isAnswered}
                onClick={() => answerQuestion(key)}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${getChoiceStyle(key)}`}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                  {icon || key}
                </span>
                <span className="text-sm leading-relaxed pt-0.5">{choice.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className={`p-4 rounded-xl border-2 mb-6 ${
            isCorrect
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-bold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                {isCorrect ? "ถูกต้อง!" : "ไม่ถูกต้อง"}
              </span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {isAnswered && (
          <button
            onClick={nextQuestion}
            className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl text-base hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {isLastQuestion && answeredCount === questions.length
              ? "ดูผลสอบ"
              : "ข้อถัดไป"}
          </button>
        )}
      </div>

      <ResetDialog open={showReset} onClose={() => setShowReset(false)} />
    </div>
  );
}
