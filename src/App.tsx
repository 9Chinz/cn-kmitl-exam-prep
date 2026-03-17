import { useQuizStore } from "./store/quizStore";
import { StartPage } from "./components/StartPage";
import { QuizPage } from "./components/QuizPage";
import { ResultPage } from "./components/ResultPage";

function App() {
  const page = useQuizStore((s) => s.page);

  switch (page) {
    case "quiz":
      return <QuizPage />;
    case "result":
      return <ResultPage />;
    default:
      return <StartPage />;
  }
}

export default App;
