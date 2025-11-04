// src/pages/type/Q2Make.tsx  (왼쪽 가지의 두 번째 질문)
import React from "react";
import TypeQuestion from "./TypeQuestion";
export default function Q2Make() {
  return (
    <TypeQuestion
      text="나는 만들기를 좋아한다"
      bg="../../assets/typetest/1-1Q.svg"
      yesRoute="/type-test/result/a" // A
      noRoute="/type-test/result/b"  // B
    />
  );
}
