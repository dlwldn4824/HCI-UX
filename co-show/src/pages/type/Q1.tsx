// src/pages/type/Q1.tsx
import React from "react";
import TypeQuestion from "./TypeQuestion";
import q1Bg from "../../assets/typetest/FirstQBg.svg";
export default function Q1() {
  return (
    <TypeQuestion
      text=""
      bg={q1Bg} 
      yesRoute="/type-test/q2/make" // O → 왼쪽 가지
      noRoute="/type-test/q2/read"  // X → 오른쪽 가지
    />
  );
}
