import React, { useEffect, useState } from "react";
import "../styles/quiz_q1.css";
import { useNavigate } from "react-router-dom";

export default function QuizQ1() {
  const [pick, setPick] = useState(null); // 'O' | 'X' | null
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("q1-route");
    return () => document.body.classList.remove("q1-route");
  }, []);

  const onConfirm = () => {
    if (!pick) return;

    // ✅ 정답 판단
    if (pick === "O") {
      navigate("/quiz/1/result");
    } else {
      navigate("/quiz/1/wrong"); // 오답 페이지
    }
  };

  return (
    <main className="q1-page">
      <div className="q1-canvas">
        {/* O 버튼 */}
        <button
          type="button"
          aria-label="O"
          className={[
            "q1-btn",
            "q1-btn-o",
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
            "q1-btn",
            "q1-btn-x",
            pick === "O" ? "shrink" : "",
            pick === "X" ? "selected" : "",
          ].join(" ")}
          onClick={() => setPick("X")}
        />

        {/* 정답 확인 */}
        <button
          type="button"
          className={`q1-confirm ${pick ? "enabled" : "disabled"}`}
          onClick={onConfirm}
          disabled={!pick}
          aria-disabled={!pick}
          aria-label="정답 확인"
        />
      </div>
    </main>
  );
}
