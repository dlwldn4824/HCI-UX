// src/pages/type/Q2Make.tsx  (왼쪽 가지의 두 번째 질문)
import React from "react";
import TypeQuestion from "./TypeQuestion";
import q2Bg from "../../assets/typetest/1-1Q.svg";

export default function Q2Make() {
  return (
    <TypeQuestion
      text=""
      bg={q2Bg}
      yesRoute="/type-test/result/a" // A
      noRoute="/type-test/result/b"  // B
    />
  );
}
