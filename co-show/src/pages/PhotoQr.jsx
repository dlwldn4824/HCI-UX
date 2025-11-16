import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import finishBtn from "../assets/photo/finishbutton.svg";  

export default function PhotoQr() {
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("qrUrl");
    if (!saved) {
      navigate("/");
      return;
    }
    setQrUrl(saved);
  }, []);

  if (!qrUrl) return null;

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
