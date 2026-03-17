import { useState } from "react";
import { useQuizStore } from "../store/quizStore";

const levelLabels: Record<string, string> = {
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
  random: "Random",
};

export function NameInput() {
  const { pendingLevel, startQuiz, cancelNameInput } = useQuizStore();
  const [name, setName] = useState(() => localStorage.getItem("cn-quiz-last-name") || "");

  if (!pendingLevel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelNameInput} />
      <div className="relative w-full max-w-sm mx-4 mb-0 sm:mb-0 bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-xl p-6">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4 sm:hidden" />
        <h3 className="text-lg font-bold text-center mb-1">ใส่ชื่อผู้ทำข้อสอบ</h3>
        <p className="text-sm text-muted-foreground text-center mb-5">
          ระดับ: {levelLabels[pendingLevel]} · 60 ข้อ
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อ หรือ ชื่อเล่น"
          autoFocus
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) startQuiz(name.trim());
          }}
        />

        <button
          onClick={() => startQuiz(name.trim())}
          disabled={!name.trim()}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          เริ่มทำข้อสอบ
        </button>
        <button
          onClick={cancelNameInput}
          className="w-full mt-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}
