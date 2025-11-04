// src/pages/type/Q1.tsx
import React from "react";
import TypeQuestion from "./TypeQuestion";
export default function Q1() {
  return (
    <TypeQuestion
      text="나는 활동적인 편이다"
      bg="../../assets/typetest/TypeTestStartBg.svg"
      yesRoute="/type-test/q2/make" // O → 왼쪽 가지
      noRoute="/type-test/q2/read"  // X → 오른쪽 가지
    />
  );
}
