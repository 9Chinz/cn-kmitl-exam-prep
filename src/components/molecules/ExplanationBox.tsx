interface ExplanationBoxProps {
  correct: boolean;
  text: string;
}

export function ExplanationBox({ correct, text }: ExplanationBoxProps) {
  return (
    <div className={`p-4 rounded-xl border-2 mb-6 ${
      correct
        ? "bg-green-500/10 border-green-200 dark:border-green-800"
        : "bg-red-500/10 border-red-200 dark:border-red-800"
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-sm font-bold ${correct ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
          {correct ? "ถูกต้อง!" : "ไม่ถูกต้อง"}
        </span>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
    </div>
  );
}
