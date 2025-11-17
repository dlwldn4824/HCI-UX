import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import finishBtn from "../assets/photo/finishbutton.svg";  

export default function PhotoQr() {
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(true);  // ⭐ 로딩 상태 추가

  useEffect(() => {
    const saved = localStorage.getItem("qrUrl");

    // 저장된 값이 없다면 홈으로
    if (!saved) {
      navigate("/");
      return;
    }

    // QR 경로 적용
    setQrUrl(saved);

    // 0.3~0.5초 정도 로딩 후 스피너 제거
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  // ⭐ 로딩 스피너 화면
  if (loading) {
    return (
      <main
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
        }}
      >
        <div className="spinner" />
      </main>
    );
  }

  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "300px",
        background: "white",
      }}
    >
      <img
        src={qrUrl}
        alt="QR Code"
        style={{
          width: 600,
          height: 600,
        }}
      />

      <img
        src={finishBtn}
        alt="완료 버튼"
        onClick={() => navigate("/")}
        style={{
          marginTop: "30px",
          width: "500px",
          height: "auto",
          cursor: "pointer",
        }}
      />
    </main>
  );
}
