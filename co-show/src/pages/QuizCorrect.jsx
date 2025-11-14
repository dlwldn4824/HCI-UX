// /pages/QuizCorrect.jsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/subquizs.css";

export default function QuizCorrect() {
  const { qid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("quiz-correct-route", `qz-q${qid}`);
    return () => document.body.classList.remove("quiz-correct-route", `qz-q${qid}`);
  }, [qid]);

  const handleNext = () => {
    const current = Number(qid);
    if (current < 3) {
      navigate(`/quiz/${current + 1}`); // 다음 문제로 이동
    } else {
      navigate("/events/complete"); // 마지막 문제면 완료 페이지로
    }
  };

  return (
    <main className="qz-page">
      <div className={`qz-result qz-q${qid}`}>
        <div className="qz-result-text qz-correct-text" />
        <button className="qz-next-btn" onClick={handleNext} />
      </div>
    </main>
  );
}
