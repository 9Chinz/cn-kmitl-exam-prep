import { useQuizStore } from "./store/quizStore";
import { StartPage } from "./components/StartPage";
import { QuizPage } from "./components/QuizPage";
import { ResultPage } from "./components/ResultPage";
import { StatsPage } from "./components/StatsPage";
import { ThemeToggle } from "./components/ThemeToggle";

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
