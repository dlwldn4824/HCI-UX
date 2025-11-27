// src/pages/PhotoQr.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

import finishBtn from "../assets/photo/finishbutton.svg";
import rephoto from "../assets/photo/retry.svg";

export default function PhotoQr() {
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("photoUrl");

    if (!saved) {
      // 사진을 안 찍고 들어왔거나, 스토리지 비었을 때
      navigate("/");
      return;
    }

    setPhotoUrl(saved);
  }, [navigate]);

  const handleRetake = () => {
    localStorage.removeItem("photoUrl");
    navigate("/photo/filter");
  };

  const handleFinish = () => {
    localStorage.removeItem("photoUrl");
    navigate("/");
  };

  return (
    <main
      style={{
        width: "1920px",
        height: "1200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "250px",
        background: "white",
      }}
    >
      {photoUrl && (
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "24px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          }}
        >
          <QRCode
            value={photoUrl}
            size={600}
            style={{ width: "600px", height: "600px" }}
          />
        </div>
      )}

      {/* 버튼 두 개를 감싸는 영역 */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "0px",
          alignItems: "center",
        }}
      >
        {/* 다시 찍기 버튼 */}
        <img
          src={rephoto}
          onClick={handleRetake}
          style={{
            height: "100px",
            cursor: "pointer",
            marginRight: "-70px",
          }}
          alt="다시 찍기"
        />

        {/* 완료 버튼 */}
        <img
          src={finishBtn}
          alt="완료 버튼"
          onClick={handleFinish}
          style={{
            height: "100px",
            cursor: "pointer",
            marginRight: "-70px",
          }}
        />
      </div>
    </main>
  );
}
