import { useSubjectStore } from "@/store/subjectStore";
import { useHistoryStore } from "@/store/historyStore";
import { subjectList } from "@/config/subjects";
import type { SubjectConfig } from "@/types/subject";

function SubjectCard({ subject }: { subject: SubjectConfig }) {
  const { selectSubject } = useSubjectStore();
  const { reloadHistory } = useHistoryStore();
  const isAvailable = subject.levelGroups.length > 0;

  return (
    <button
      onClick={() => {
        if (!isAvailable) return;
        selectSubject(subject.id);
        reloadHistory();
      }}
      disabled={!isAvailable}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isAvailable
          ? "border-border hover:border-primary/50 hover:bg-accent/50 active:scale-[0.98]"
          : "border-border/50 opacity-60 cursor-not-allowed"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`w-12 h-12 rounded-xl ${subject.color} flex items-center justify-center text-2xl text-white shrink-0`}>
          {subject.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-foreground text-sm">{subject.name}</div>
          <div className="text-xs text-muted-foreground">{subject.code}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {isAvailable ? subject.description : "Coming soon"}
          </div>
        </div>
      </div>
    </button>
  );
}

export function SubjectSelectPage() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            KMITL Exam Prep
          </h1>
          <p className="text-sm text-muted-foreground">
            เลือกวิชาที่ต้องการทำข้อสอบ
          </p>
        </div>

        <div className="space-y-3">
          {subjectList.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>
    </div>
  );
}
