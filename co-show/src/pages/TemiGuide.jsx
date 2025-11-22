// src/pages/TemiGuide.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Capacitor } from '@capacitor/core';

// 👇 안드로이드 플러그인 연결 (이름 "TemiControl" 일치 필수)
const { TemiControl } = Capacitor.Plugins;

export default function TemiGuide() {
  const location = useLocation();
  const navigate = useNavigate();

  // 전달받은 장소 이름 꺼내기
  const targetLocation = location.state?.targetLocation; 

  const [statusText, setStatusText] = useState("안내를 준비하고 있습니다...");

  useEffect(() => {
    const startTemiMove = async () => {
      if (!targetLocation) {
        setStatusText("목적지 정보가 없습니다.");
        return;
      }

      try {
        setStatusText(`'${targetLocation}'(으)로 이동합니다! 🚀`);

        // 👇 [핵심] 실제 테미 로봇에게 이동 명령 전송
        if (TemiControl) {
          await TemiControl.goTo({ location: targetLocation });
          console.log(`${targetLocation} 이동 명령 전송 성공`);
        } else {
          console.warn("TemiControl 플러그인을 찾을 수 없습니다.");
        }

      } catch (error) {
        console.error("테미 이동 에러:", error);
        setStatusText("로봇 연결 상태를 확인해주세요.");
      }
    };

    startTemiMove();
  }, [targetLocation]);

  return (
    <main style={{ 
      width: "1900px", height: "1200px", 
      display: "flex", alignItems: "center", justifyContent: "center", 
      background: "#f5f5f5", fontFamily: "nanumRound" 
    }}>
      <div style={{ 
        padding: "40px 60px", borderRadius: "20px", 
        background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", 
        textAlign: "center" 
      }}>
        <h1 style={{ margin: 0, fontSize: "32px" }}>{statusText}</h1>
        <p style={{ marginTop: "12px", fontSize: "18px", opacity: 0.7 }}>
          잠시만 기다려 주세요.
        </p>
        
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            marginTop: "30px", padding: "10px 20px", fontSize: "16px", 
            border: "1px solid #ccc", borderRadius: "5px" 
          }}
        >
          뒤로 가기
        </button>
      </div>
    </main>
  );
}