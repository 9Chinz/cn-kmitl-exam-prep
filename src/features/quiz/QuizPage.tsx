import { useState, useEffect } from "react";
import { useQuizStore } from "@/store/quizStore";
import { MenuDialog } from "./MenuDialog";
import { LevelBadge } from "@/components/molecules/LevelBadge";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { TimeDisplay } from "@/components/atoms/TimeDisplay";
import { ChoiceButton } from "@/components/molecules/ChoiceButton";
import { ExplanationBox } from "@/components/molecules/ExplanationBox";
import { Button } from "@/components/atoms/Button";
import { getLectureName } from "@/constants/lectures";

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

  const [showMenu, setShowMenu] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const setPage = useQuizStore((s) => s.setPage);

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

  // Handle browser back button
  useEffect(() => {
    history.pushState(null, "", location.href);
    const onPopState = () => {
      history.pushState(null, "", location.href);
      setPage("start");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [setPage]);

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

  const getChoiceState = (originalKey: string): "default" | "correct" | "wrong" | "dimmed" => {
    if (!isAnswered) return "default";
    if (originalKey === question.correctAnswer) return "correct";
    if (originalKey === selectedOriginalKey && originalKey !== question.correctAnswer) return "wrong";
    return "dimmed";
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
            <LevelBadge level={level} />
            <span className="text-sm font-medium text-muted-foreground">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <TimeDisplay seconds={elapsed} className="text-sm text-muted-foreground" />
            <Button
              variant="icon"
              onClick={() => setShowMenu(true)}
              aria-label="Menu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <ProgressBar value={answeredCount} max={questions.length} className="max-w-lg mx-auto mt-2" />
      </div>

      {/* Question */}
      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <div className="mb-1">
          <span className="text-xs text-muted-foreground">
            {getLectureName(question.lecture)}
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
            return (
              <ChoiceButton
                key={displayIndex}
                label={label}
                text={choice.text}
                state={getChoiceState(originalKey)}
                icon={getChoiceIcon(originalKey)}
                disabled={isAnswered}
                onClick={() => answerQuestion(originalKey)}
              />
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <ExplanationBox correct={isCorrect} text={question.explanation} />
        )}

        {/* Next button */}
        {isAnswered && (
          <Button variant="primary" onClick={nextQuestion} className="py-3.5 text-base">
            {isLastQuestion && answeredCount === questions.length
              ? "\u0e14\u0e39\u0e1c\u0e25\u0e2a\u0e2d\u0e1a"
              : "\u0e02\u0e49\u0e2d\u0e16\u0e31\u0e14\u0e44\u0e1b"}
          </Button>
        )}
      </div>

      <MenuDialog open={showMenu} onClose={() => setShowMenu(false)} />
    </div>
  );
}
