import { useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import { useSubjectStore } from "@/store/subjectStore";
import { Modal } from "@/components/molecules/Modal";
import { Button } from "@/components/atoms/Button";
import { Switch } from "@/components/atoms/Switch";
import { levelLabels } from "@/constants/levels";

export function NameInput() {
  const { pendingLevel, startQuiz, cancelNameInput } = useQuizStore();
  const [name, setName] = useState(() => localStorage.getItem("quiz-app-last-name") || localStorage.getItem("cn-quiz-last-name") || "");
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleChoices, setShuffleChoices] = useState(false);

  const config = useSubjectStore((s) => s.getConfig());
  if (!pendingLevel) return null;

  const questionCount = config?.questions[pendingLevel]?.length ?? 60;

  const handleStart = () => {
    if (!name.trim()) return;
    startQuiz(name.trim(), { shuffleQuestions, shuffleChoices });
  };

  return (
    <Modal open={true} onClose={cancelNameInput}>
      <h3 className="text-lg font-bold text-center mb-1">ใส่ชื่อผู้ทำข้อสอบ</h3>
      <p className="text-sm text-muted-foreground text-center mb-5">
        ระดับ: {levelLabels[pendingLevel]} · {questionCount} ข้อ
      </p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ชื่อ หรือ ชื่อเล่น"
        autoFocus
        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleStart();
        }}
      />

      <div className="space-y-2 mb-4">
        <label className="flex items-center justify-between p-2.5 rounded-lg border border-border cursor-pointer hover:bg-accent/50 transition-colors">
          <div>
            <div className="text-sm font-medium text-foreground">Shuffle Questions</div>
            <div className="text-xs text-muted-foreground">สุ่มลำดับคำถาม</div>
          </div>
          <Switch
            checked={shuffleQuestions}
            onCheckedChange={setShuffleQuestions}
          />
        </label>
        <label className="flex items-center justify-between p-2.5 rounded-lg border border-border cursor-pointer hover:bg-accent/50 transition-colors">
          <div>
            <div className="text-sm font-medium text-foreground">Shuffle Answers</div>
            <div className="text-xs text-muted-foreground">สุ่มลำดับตัวเลือก</div>
          </div>
          <Switch
            checked={shuffleChoices}
            onCheckedChange={setShuffleChoices}
          />
        </label>
      </div>

      <Button
        variant="primary"
        onClick={handleStart}
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
