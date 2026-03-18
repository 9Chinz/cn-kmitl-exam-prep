import { useQuizStore } from "@/store/quizStore";
import { useSubjectStore } from "@/store/subjectStore";
import { Modal } from "@/components/molecules/Modal";
import type { Level } from "@/types/quiz";

interface LevelOption {
  level: Level;
  label: string;
  desc: string;
  color: string;
}

function LevelButton({ label, desc, color, onClick }: Omit<LevelOption, "level"> & { onClick: () => void }) {
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
  const config = useSubjectStore((s) => s.getConfig());

  if (!config) return null;

  return (
    <Modal open={true} onClose={closeLevelModal} maxWidth="max-w-md">
      <h3 className="text-lg font-bold text-center mb-4">เลือกระดับข้อสอบ</h3>

      {config.levelGroups.map((group, gi) => (
        <div key={gi} className={gi < config.levelGroups.length - 1 ? "mb-4" : "mb-2"}>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {group.groupLabel}
          </div>
          <div className="space-y-2">
            {group.levels.map((opt) => (
              <LevelButton key={opt.level} {...opt} onClick={() => selectLevel(opt.level)} />
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={closeLevelModal}
        className="w-full mt-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ยกเลิก
      </button>
    </Modal>
  );
}
