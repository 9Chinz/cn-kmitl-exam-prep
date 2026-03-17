import { useQuizStore } from "@/store/quizStore";
import { Modal } from "@/components/molecules/Modal";
import type { Level } from "@/types/quiz";

interface LevelOption {
  level: Level;
  label: string;
  desc: string;
  color: string;
}

const originalLevels: LevelOption[] = [
  { level: "easy", label: "Easy", desc: "คำถามพื้นฐาน จำข้อมูลและนิยาม", color: "bg-green-500 hover:bg-green-600" },
  { level: "normal", label: "Normal", desc: "ทดสอบความเข้าใจและเปรียบเทียบ", color: "bg-yellow-500 hover:bg-yellow-600" },
  { level: "hard", label: "Hard", desc: "สถานการณ์จำลอง คำนวณ และวิเคราะห์", color: "bg-red-500 hover:bg-red-600" },
  { level: "random", label: "Random", desc: "สุ่มคำถามจากทุกระดับ 20 ข้อต่อระดับ", color: "bg-purple-500 hover:bg-purple-600" },
];

const guidelineLevels: LevelOption[] = [
  { level: "guideline-easy", label: "Easy", desc: "คำถามจากตัวอย่างข้อสอบตรง ๆ", color: "bg-cyan-500 hover:bg-cyan-600" },
  { level: "guideline-normal", label: "Normal", desc: "เนื้อหาเดียวกัน แต่ถามลึกขึ้น", color: "bg-cyan-600 hover:bg-cyan-700" },
  { level: "guideline-hard", label: "Hard", desc: "สถานการณ์จำลอง วิเคราะห์เชิงลึก", color: "bg-cyan-700 hover:bg-cyan-800" },
  { level: "guideline-random", label: "Random", desc: "สุ่มจากทุกระดับ Guideline", color: "bg-cyan-400 hover:bg-cyan-500" },
];

function LevelButton({ level, label, desc, color, onClick }: LevelOption & { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3.5 rounded-xl text-white transition-all active:scale-[0.98] ${color}`}
    >
      <div className="text-left">
        <div className="font-bold text-sm">{label}</div>
        <div className="text-xs opacity-90">{desc}</div>
      </div>
    </button>
  );
}

export function LevelModal() {
  const { selectLevel, closeLevelModal } = useQuizStore();

  return (
    <Modal open={true} onClose={closeLevelModal} maxWidth="max-w-md">
      <h3 className="text-lg font-bold text-center mb-4">เลือกระดับข้อสอบ</h3>

      {/* Original levels */}
      <div className="mb-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
          Original (เนื้อหาบทเรียน)
        </div>
        <div className="space-y-2">
          {originalLevels.map((opt) => (
            <LevelButton key={opt.level} {...opt} onClick={() => selectLevel(opt.level)} />
          ))}
        </div>
      </div>

      {/* Guideline levels */}
      <div className="mb-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
          Guideline (ตัวอย่างข้อสอบ)
        </div>
        <div className="space-y-2">
          {guidelineLevels.map((opt) => (
            <LevelButton key={opt.level} {...opt} onClick={() => selectLevel(opt.level)} />
          ))}
        </div>
      </div>

      <button
        onClick={closeLevelModal}
        className="w-full mt-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ยกเลิก
      </button>
    </Modal>
  );
}
