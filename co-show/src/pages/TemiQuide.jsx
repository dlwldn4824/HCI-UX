import React from "react";

export default function Teleport() {
  return (
    <main
      style={{
        width: "1900px",
        height: "1200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        fontFamily: "nanumRound",
      }}
    >
      <div
        style={{
          padding: "40px 60px",
          borderRadius: "20px",
          background: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "32px" }}>Teleport 기능 준비중</h1>
        <p style={{ marginTop: "12px", fontSize: "18px", opacity: 0.7 }}>
          이 페이지는 텔레포트 기능이 들어갈 예정입니다.
        </p>
      </div>
    </main>
  );
}
