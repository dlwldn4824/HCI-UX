// src/pages/type/Q2Read.tsx  (오른쪽 가지의 두 번째 질문)
import React from "react";
import TypeQuestion from "./TypeQuestion";
import q3Bg from "../../assets/typetest/1-2Q.svg";

export default function Q2Read() {
  return (
    <TypeQuestion
      text=""
      bg={q3Bg}
      yesRoute="/type-test/result/c" // C
      noRoute="/type-test/result/d"  // D
    />
  );
}
