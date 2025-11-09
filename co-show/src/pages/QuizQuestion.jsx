import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/subquizs.css";
import { quizConfig } from "../data/quizConfig";

export default function QuizQuestion() {
  const { qid } = useParams();        // "1" | "2" | "3"
  const [pick, setPick] = useState(null); // 'O' | 'X' | null
  const navigate = useNavigate();
  const conf = quizConfig[qid];

  useEffect(() => {
    // 라우트/문항별로 body 클래스 부여 → CSS에서 배경 분기
    document.body.classList.add("quiz-route", `qz-q${qid}`);


 
    return () => {
      document.body.classList.remove("quiz-route", `qz-q${qid}`);
    };
  }, [qid]);

  const onConfirm = () => {
    if (!pick || !conf) return;
    if (pick === conf.correct) navigate(`/quiz/${qid}/correct`);
    else navigate(`/quiz/${qid}/wrong`);
  };

  return (
    <main className="qz-page">
      <div className={`qz-canvas qz-q${qid}`}>
        {/* O 버튼 */}
        <button
          type="button"
          aria-label="O"
          className={[
            "qz-btn", "qz-btn-o",
            pick === "X" ? "shrink" : "",
            pick === "O" ? "selected" : "",
          ].join(" ")}
          onClick={() => setPick("O")}
        />

        {/* X 버튼 */}
        <button
          type="button"
          aria-label="X"
          className={[
            "qz-btn", "qz-btn-x",
            pick === "O" ? "shrink" : "",
            pick === "X" ? "selected" : "",
          ].join(" ")}
          onClick={() => setPick("X")}
        />

        {/* 정답 확인 */}
        <button
          type="button"
          className={`qz-confirm ${pick ? "enabled" : "disabled"}`}
          onClick={onConfirm}
          disabled={!pick}
          aria-disabled={!pick}
        />
      </div>
    </main>
  );
}
