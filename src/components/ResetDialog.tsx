import { useQuizStore } from "../store/quizStore";

interface ResetDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ResetDialog({ open, onClose }: ResetDialogProps) {
  const { resetQuiz } = useQuizStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm mx-4 bg-card rounded-2xl border border-border shadow-xl p-6">
        <h3 className="text-lg font-bold text-center mb-2">
          ต้องการรีเซ็ตข้อสอบ?
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-6">
          ผลการตอบทั้งหมดจะถูกลบ และเริ่มใหม่ตั้งแต่ข้อ 1
        </p>

        <div className="space-y-2">
          <button
            onClick={() => {
              resetQuiz();
              onClose();
            }}
            className="w-full py-3 px-4 bg-destructive text-white font-medium rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            รีเซ็ตกลับไปข้อ 1
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-secondary text-secondary-foreground font-medium rounded-xl text-sm hover:bg-accent transition-all"
          >
            ไม่รีเซ็ต ทำต่อ
          </button>
        </div>
      </div>
    </div>
  );
}
