// src/pages/type/TypeResult.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./type.css";

const resultMap: Record<string, { title: string; bg: string; desc: string }> = {
  a: { title: "A형을 추천드립니다!", bg: "../../assets/typetest/Azone.svg", desc: "활동적 + 만들기 선호" },
  b: { title: "B형을 추천드립니다!", bg: "../../assets/typetest/Bzone.svg", desc: "활동적 + 만들기 비선호" },
  c: { title: "C형을 추천드립니다!", bg: "../../assets/typetest/Czone.svg", desc: "비활동적 + 독서 선호" },
  d: { title: "D형을 추천드립니다!", bg: "../../assets/typetest/Dzone.svg", desc: "비활동적 + 독서 비선호" },
};

export default function TypeResult() {
  const { rid = "a" } = useParams();
  const nav = useNavigate();
  const data = resultMap[rid.toLowerCase()] ?? resultMap.a;

  return (
    <main className="type-page" style={{ backgroundImage: `url(${data.bg})` }}>
      <div className="type-result">
        <h2 className="type-result-title">{data.title}</h2>
        <p className="type-result-desc">{data.desc}</p>
        <div className="type-result-actions">
          <button className="btn-primary" onClick={() => nav("/type-test")}>다시하기</button>
          <button className="btn-secondary" onClick={() => nav("/")}>메인으로</button>
        </div>
      </div>
    </main>
  );
}
