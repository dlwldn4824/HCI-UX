import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quiz1_wrong.css";

export default function Quiz1Wrong() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("quiz1-wrong-route");
    return () => document.body.classList.remove("quiz1-wrong-route");
  }, []);

  return (
    <main className="q1w-page">
      <div className="q1w-canvas">
        {/* 오답 안내(텍스트 이미지를 배경으로 쓸 수도 있음) */}
        <div className="q1w-text" />

        {/* 다시 풀기 버튼 */}
        <button
          type="button"
          className="q1w-btn q1w-btn-retry"
          aria-label="다시 풀기"
          onClick={() => navigate("/quiz/1")}
        />

        {/* (선택) 해설 보기/정답 보기 버튼 — 원하면 비활성화하거나 숨겨도 됨 */}
        <button
          type="button"
          className="q1w-btn q1w-btn-explain"
          aria-label="정답 보기"
          onClick={() => navigate("/quiz/1/result")}
        />
      </div>
    </main>
  );
}
