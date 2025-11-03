import { useNavigate } from "react-router-dom";
import "../styles/Quiz.css";

export default function Quiz(){
  const nav = useNavigate();
  return (
    <main className="quiz-page">
      <section className="quiz-stage" />
      <button
        className="quiz-cta"
        onClick={() => nav("/quiz/1")}
        aria-label="퀴즈 도전"
      >
        <img src={"src/assets/quiz/Group 97.svg"} alt="퀴즈 도전" />
      </button>
    </main>
  );
}
