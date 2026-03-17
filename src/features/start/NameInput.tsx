import { useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import { Modal } from "@/components/molecules/Modal";
import { Button } from "@/components/atoms/Button";
import { levelLabels } from "@/constants/levels";

export function NameInput() {
  const { pendingLevel, startQuiz, cancelNameInput } = useQuizStore();
  const [name, setName] = useState(() => localStorage.getItem("cn-quiz-last-name") || "");

  if (!pendingLevel) return null;

  return (
    <Modal open={true} onClose={cancelNameInput}>
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

      <Button
        variant="primary"
        onClick={() => startQuiz(name.trim())}
        disabled={!name.trim()}
        className="disabled:opacity-40 disabled:cursor-not-allowed"
      >
        เริ่มทำข้อสอบ
      </Button>
      <Button variant="ghost" onClick={cancelNameInput} className="mt-2 py-2.5">
        ยกเลิก
      </Button>
    </Modal>
  );
}
