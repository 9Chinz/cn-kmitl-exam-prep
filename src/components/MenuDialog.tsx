import { useState } from "react";
import { useQuizStore } from "../store/quizStore";

interface MenuDialogProps {
  open: boolean;
  onClose: () => void;
}

export function MenuDialog({ open, onClose }: MenuDialogProps) {
  const { resetQuiz, setPage } = useQuizStore();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!open) return null;

  if (confirmReset) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmReset(false)} />
        <div className="relative w-full max-w-sm mx-4 mb-0 sm:mb-0 bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-xl p-6">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4 sm:hidden" />
          <h3 className="text-lg font-bold text-center mb-2">
            ยืนยันรีเซ็ต?
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            ผลการตอบทั้งหมดจะถูกลบ และเริ่มใหม่ตั้งแต่ข้อ 1
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                resetQuiz();
                setConfirmReset(false);
                onClose();
              }}
              className="w-full py-3 px-4 bg-red-500 text-white font-medium rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              รีเซ็ตกลับไปข้อ 1
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="w-full py-3 px-4 bg-secondary text-secondary-foreground font-medium rounded-xl text-sm hover:bg-accent transition-all"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm mx-4 mb-0 sm:mb-0 bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-xl p-6">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4 sm:hidden" />
        <h3 className="text-lg font-bold text-center mb-4">เมนู</h3>

        <div className="space-y-2">
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-border hover:bg-accent transition-colors text-left"
          >
            <span className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </span>
            <div>
              <div className="text-sm font-medium">รีเซ็ตข้อสอบ</div>
              <div className="text-xs text-muted-foreground">เริ่มทำใหม่ตั้งแต่ข้อ 1</div>
            </div>
          </button>

          <button
            onClick={() => {
              setPage("start");
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-border hover:bg-accent transition-colors text-left"
          >
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <div>
              <div className="text-sm font-medium">เปลี่ยนระดับ</div>
              <div className="text-xs text-muted-foreground">กลับหน้าหลักเลือกระดับใหม่</div>
            </div>
          </button>

          <button
            onClick={() => {
              setPage("start");
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-border hover:bg-accent transition-colors text-left"
          >
            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <div>
              <div className="text-sm font-medium">กลับหน้าหลัก</div>
              <div className="text-xs text-muted-foreground">ความก้าวหน้าจะถูกบันทึกไว้</div>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ทำต่อ
        </button>
      </div>
    </div>
  );
}
