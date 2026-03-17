import { useQuizStore } from "@/store/quizStore";
import { StartPage } from "@/features/start/StartPage";
import { QuizPage } from "@/features/quiz/QuizPage";
import { ResultPage } from "@/features/result/ResultPage";
import { StatsPage } from "@/features/stats/StatsPage";
import { ThemeToggle } from "@/components/organisms/ThemeToggle";

function App() {
  const page = useQuizStore((s) => s.page);

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
