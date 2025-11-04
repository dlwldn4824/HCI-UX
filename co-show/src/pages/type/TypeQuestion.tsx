// src/pages/type/TypeQuestion.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./type.css";

type Props = {
  text: string;
  bg: string;          // 배경 이미지 경로
  yesRoute: string;    // O
  noRoute: string;     // X
};

export default function TypeQuestion({ text, bg, yesRoute, noRoute }: Props) {
  const navigate = useNavigate();
  return (
    <main className="type-page" style={{ backgroundImage: `url(${bg})` }}>
      <div className="type-card">
        <p className="type-q">{text}</p>
        <div className="type-btns">
          <button className="btn-ox btn-o" onClick={() => navigate(yesRoute)} aria-label="예(O)" />
          <button className="btn-ox btn-x" onClick={() => navigate(noRoute)} aria-label="아니오(X)" />
        </div>
      </div>
    </main>
  );
}
