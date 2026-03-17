import { useState, useEffect } from "react";
import { useQuizStore } from "../store/quizStore";
import { ResetDialog } from "./ResetDialog";
import { formatTime } from "../lib/utils";

const levelLabels = { easy: "Easy", normal: "Normal", hard: "Hard" };
const levelColors = {
  easy: "bg-green-500",
  normal: "bg-yellow-500",
  hard: "bg-red-500",
};

const displayLabels = ["A", "B", "C", "D"];

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

  // shuffledChoices[currentIndex] = e.g. ["C", "A", "D", "B"]
  // This means: display position A shows original choice C's text,
  //             display position B shows original choice A's text, etc.
  const choiceOrder = shuffledChoices[currentIndex] || ["A", "B", "C", "D"];

  // The user's answer is stored as the ORIGINAL key (e.g. "C")
  const selectedOriginalKey = answers[currentIndex];
  const isAnswered = selectedOriginalKey !== undefined;
  const isCorrect = selectedOriginalKey === question.correctAnswer;
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  // Map: which display label maps to which original key
  // displayLabels[i] shows content from choiceOrder[i]
  const getOriginalKeyForDisplay = (displayIndex: number) => choiceOrder[displayIndex];

  const getChoiceStyle = (originalKey: string) => {
    if (!isAnswered) {
      return "bg-card border-border hover:border-primary/50 hover:bg-primary/5 active:scale-[0.99]";
    }
    if (originalKey === question.correctAnswer) {
      return "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400";
    }
    if (originalKey === selectedOriginalKey && originalKey !== question.correctAnswer) {
      return "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400";
    }
    return "bg-card border-border opacity-50";
  };

  const getChoiceIcon = (originalKey: string) => {
    if (!isAnswered) return null;
    if (originalKey === question.correctAnswer) return "\u2713";
    if (originalKey === selectedOriginalKey && originalKey !== question.correctAnswer) return "\u2717";
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
            {question.lecture.replace("Lec8-Ethernet", "Lec 8 \u00b7 Ethernet")
              .replace("Lec9A-NetworkLayer", "Lec 9A \u00b7 Network Layer")
              .replace("Lec9B-Subnetting", "Lec 9B \u00b7 Subnetting")
              .replace("Lec10-VLAN", "Lec 10 \u00b7 VLAN/DHCP/IPv6")
              .replace("Lec11-Routing", "Lec 11 \u00b7 Routing")
              .replace("Lec12-Transport", "Lec 12 \u00b7 Transport/App Layer")}
          </span>
        </div>
        <h2 className="text-base font-semibold text-foreground mb-5 leading-relaxed">
          {currentIndex + 1}. {question.question}
        </h2>

        {/* Choices - always A, B, C, D in order, content shuffled */}
        <div className="space-y-2.5 mb-6">
          {displayLabels.map((label, displayIndex) => {
            const originalKey = getOriginalKeyForDisplay(displayIndex);
            const choice = question.choices.find((c) => c.key === originalKey);
            if (!choice) return null;
            const icon = getChoiceIcon(originalKey);
            return (
              <button
                key={displayIndex}
                disabled={isAnswered}
                onClick={() => answerQuestion(originalKey)}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${getChoiceStyle(originalKey)}`}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                  {icon || label}
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
              ? "bg-green-500/10 border-green-200 dark:border-green-800"
              : "bg-red-500/10 border-red-200 dark:border-red-800"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-bold ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                {isCorrect ? "\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07!" : "\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07"}
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
              ? "\u0e14\u0e39\u0e1c\u0e25\u0e2a\u0e2d\u0e1a"
              : "\u0e02\u0e49\u0e2d\u0e16\u0e31\u0e14\u0e44\u0e1b"}
          </button>
        )}
      </div>

      <ResetDialog open={showReset} onClose={() => setShowReset(false)} />
    </div>
  );
}
