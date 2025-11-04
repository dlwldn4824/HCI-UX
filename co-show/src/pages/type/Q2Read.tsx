// src/pages/type/Q2Read.tsx  (오른쪽 가지의 두 번째 질문)
import React from "react";
import TypeQuestion from "./TypeQuestion";
export default function Q2Read() {
  return (
    <TypeQuestion
      text="나는 독서를 좋아한다"
      bg="../../assets/typetest/1-2Q.svg"
      yesRoute="/type-test/result/c" // C
      noRoute="/type-test/result/d"  // D
    />
  );
}
