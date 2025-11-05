// src/pages/type/TypeResult.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./type.css";

// ✅ 이미지 import (Vite가 빌드 타임 처리)
import Azone from "../../assets/typetest/Azone.svg";
import Bzone from "../../assets/typetest/Bzone.svg";
import Czone from "../../assets/typetest/Czone.svg";
import Dzone from "../../assets/typetest/Dzone.svg";

const resultMap: Record<string, { title: string; bg: string; desc: string }> = {
  a: { title: "A형을 추천드립니다!", bg: Azone, desc: "활동적 + 만들기 선호" },
  b: { title: "B형을 추천드립니다!", bg: Bzone, desc: "활동적 + 만들기 비선호" },
  c: { title: "C형을 추천드립니다!", bg: Czone, desc: "비활동적 + 독서 선호" },
  d: { title: "D형을 추천드립니다!", bg: Dzone, desc: "비활동적 + 독서 비선호" },
};

export default function TypeResult() {
  const { rid } = useParams();
  const nav = useNavigate();
  const key = (rid ?? "a").toLowerCase();
  const data = resultMap[key] ?? resultMap.a;

  return (
    <main
      className="type-page"
      style={{
        backgroundImage: `url(${data.bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
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
