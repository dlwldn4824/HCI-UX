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

        {/* qid가 3일 때는 사진 찍으러 가기 버튼 */}
        {qid === "3" ? (
          <button
            className="qz-photo-btn"
            onClick={() => navigate("/photo")}
          />
        ) : (
          // 그 외에는 기존 retry 버튼
          <button
            className="qz-retry-btn"
            onClick={() => navigate(`/quiz/${qid}`)}
          />
        )}

        {/* 설명 보기 버튼은 항상 유지 */}
        <button
          className="qz-explain-btn"
          onClick={() => navigate(`/quiz/${qid}/result`)}
        />
      </div>
    </main>
  );
}
