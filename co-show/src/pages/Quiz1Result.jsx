import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/subquizs.css";

export default function QuizResult() {
  const { qid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("quiz-result-route", `qz-q${qid}`);
    return () => document.body.classList.remove("quiz-result-route", `qz-q${qid}`);
  }, [qid]);

  return (
    <main className="qz-page">
      <div className={`qz-result qz-q${qid}`}>
        <div className="qz-result-text qz-correct" />
        <button
          className="qz-next-btn"
          onClick={() => navigate(`/quiz/${Number(qid) + 1}`)} // 다음 문제로
        />
      </div>
    </main>
  );
}
