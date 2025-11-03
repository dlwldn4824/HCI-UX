import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/subquizs.css";

export default function QuizWrong() {
  const { qid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("quiz-wrong-route", `qz-q${qid}`);
    return () => document.body.classList.remove("quiz-wrong-route", `qz-q${qid}`);
  }, [qid]);

  return (
    <main className="qz-page">
      <div className={`qz-wrong qz-q${qid}`}>
        <div className="qz-result-text qz-wrong-text" />
        <button className="qz-retry-btn" onClick={() => navigate(`/quiz/${qid}`)} />
        <button className="qz-explain-btn" onClick={() => navigate(`/quiz/${qid}/result`)} />
      </div>
    </main>
  );
}
