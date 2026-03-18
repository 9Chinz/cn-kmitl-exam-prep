import { useSubjectStore } from "@/store/subjectStore";
import { useQuizStore } from "@/store/quizStore";
import { SubjectSelectPage } from "@/features/subject/SubjectSelectPage";
import { StartPage } from "@/features/start/StartPage";
import { QuizPage } from "@/features/quiz/QuizPage";
import { ResultPage } from "@/features/result/ResultPage";
import { StatsPage } from "@/features/stats/StatsPage";
import { ThemeToggle } from "@/components/organisms/ThemeToggle";

function App() {
  const subjectId = useSubjectStore((s) => s.subjectId);
  const page = useQuizStore((s) => s.page);

  if (!subjectId) {
    return (
      <>
        <ThemeToggle />
        <SubjectSelectPage />
      </>
    );
  }

  return (
    <>
      <ThemeToggle />
      {page === "quiz" ? (
        <QuizPage />
      ) : page === "result" ? (
        <ResultPage />
      ) : page === "stats" ? (
        <StatsPage />
      ) : (
        <StartPage />
      )}
    </>
  );
}

export default App;
