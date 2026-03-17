import { useQuizStore } from "./store/quizStore";
import { StartPage } from "./components/StartPage";
import { QuizPage } from "./components/QuizPage";
import { ResultPage } from "./components/ResultPage";
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
      ) : (
        <StartPage />
      )}
    </>
  );
}

export default App;
