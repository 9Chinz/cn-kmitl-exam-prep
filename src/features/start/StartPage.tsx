import { useQuizStore } from "@/store/quizStore";
import { useSubjectStore } from "@/store/subjectStore";
import { useHistoryStore } from "@/store/historyStore";
import { LevelModal } from "./LevelModal";
import { NameInput } from "./NameInput";

export function StartPage() {
  const { openLevelModal, showLevelModal, pendingLevel, checkForCheckpoint, resumeFromCheckpoint, setPage } = useQuizStore();
  const { clearSubject, getConfig } = useSubjectStore();
  const { reloadHistory } = useHistoryStore();
  const config = getConfig();

  const savedLevel = checkForCheckpoint();

  if (!config) return null;

  return (
    <div className="min-h-svh flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              {config.code} - KMITL
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {config.name}
            </h1>
            <h2 className="text-lg text-muted-foreground mb-1">
              Final Exam Quiz
            </h2>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>

          {config.lectures.length > 0 && (
            <div className="space-y-2 mb-8">
              {config.lectures.map((lec) => (
                <div
                  key={lec.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                >
                  <span className={`${lec.color} text-white text-xs font-bold px-2 py-1 rounded`}>
                    {lec.id}
                  </span>
                  <span className="text-sm text-foreground">{lec.title}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={openLevelModal}
              className="w-full py-3.5 px-6 bg-primary text-primary-foreground font-semibold rounded-xl text-base hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Start Exam
            </button>

            {savedLevel && (
              <button
                onClick={() => resumeFromCheckpoint(savedLevel)}
                className="w-full py-3 px-6 bg-secondary text-secondary-foreground font-medium rounded-xl text-sm border border-border hover:bg-accent transition-all"
              >
                Resume ({savedLevel.charAt(0).toUpperCase() + savedLevel.slice(1)} Level)
              </button>
            )}

            <button
              onClick={() => setPage("stats")}
              className="w-full py-3 px-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
              </svg>
              สถิติผู้ทำข้อสอบ
            </button>

            <button
              onClick={() => {
                clearSubject();
                reloadHistory();
              }}
              className="w-full py-3 px-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              เปลี่ยนวิชา
            </button>
          </div>
        </div>
      </div>

      {showLevelModal && <LevelModal />}
      {pendingLevel && <NameInput />}
    </div>
  );
}
