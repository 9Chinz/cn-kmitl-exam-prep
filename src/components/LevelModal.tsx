import { useQuizStore } from "../store/quizStore";
import type { Level } from "../types/quiz";

const levels: { level: Level; label: string; desc: string; color: string }[] = [
  {
    level: "easy",
    label: "Easy",
    desc: "คำถามพื้นฐาน จำข้อมูลและนิยาม",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    level: "normal",
    label: "Normal",
    desc: "ทดสอบความเข้าใจและเปรียบเทียบ",
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    level: "hard",
    label: "Hard",
    desc: "สถานการณ์จำลอง คำนวณ และวิเคราะห์",
    color: "bg-red-500 hover:bg-red-600",
  },
];

export function LevelModal() {
  const { setLevel, closeLevelModal } = useQuizStore();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeLevelModal}
      />
      <div className="relative w-full max-w-md mx-4 mb-0 sm:mb-0 bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-xl p-6 animate-in slide-in-from-bottom">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4 sm:hidden" />
        <h3 className="text-lg font-bold text-center mb-1">เลือกระดับข้อสอบ</h3>
        <p className="text-sm text-muted-foreground text-center mb-5">
          แต่ละระดับมี 60 ข้อ จาก 6 บทเรียน
        </p>

        <div className="space-y-3">
          {levels.map(({ level, label, desc, color }) => (
            <button
              key={level}
              onClick={() => setLevel(level)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl text-white transition-all active:scale-[0.98] ${color}`}
            >
              <div className="text-left">
                <div className="font-bold text-base">{label}</div>
                <div className="text-sm opacity-90">{desc}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={closeLevelModal}
          className="w-full mt-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}
