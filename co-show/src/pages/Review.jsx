import React from "react";
import bgImg from "../assets/review/설문배경.png";
import qrImg from "../assets/review/실험_사후_설문지-1024.svg"; // ← QR 이미지 경로로 교체

export default function Review() {
  return (
    <main
      style={{
        width: "1900px",
        height: "1200px",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "nanumRound",
      }}
    >
      {/* QR 이미지 */}
      <img
        src={qrImg}
        alt="QR 코드"
        style={{
          position: "absolute",
          left: "950px",
          top:"550px",
          width: "600px",     // 원하는 크기로 조절
          height: "600px",
        }}
      />
    </main>
  );
}
