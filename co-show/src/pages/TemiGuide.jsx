import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Capacitor } from '@capacitor/core';

// 👇 [중요] 안드로이드에서 새로 만든 "TemiMove" 플러그인을 불러옵니다.
const { TemiMove } = Capacitor.Plugins;

// QR 이미지 매핑 (QuickSearch.jsx의 temiLocation 이름과 일치해야 함)
const QR_MAP = {
  "racing_zone": "src/assets/지능형로봇 QR코드/경주로봇 만들기.png",
  "dog_zone": "src/assets/지능형로봇 QR코드/로봇아 멍멍해봐 4족보행로봇 활용 체험.png",
  "spider_zone": "src/assets/지능형로봇 QR코드/유선 스파이더로봇 만들기.png",
  "gyro_zone": "src/assets/지능형로봇 QR코드/자이로 외발주행로봇 만들기.png",
  "cleaning_zone": "src/assets/지능형로봇 QR코드/청소로봇 만들기.png",
  "humanoid_zone": "src/assets/지능형로봇 QR코드/휴머노이드 이론교육 및 미션수행.png",
  "drone_zone": "src/assets/지능형로봇 QR코드/AI 드로잉 로봇 및 오목 로봇 체험.png",
  "robo_show": "src/assets/지능형로봇 QR코드/ROBO SHOW.png",
};

export default function TemiGuide() {
  const location = useLocation();
  const navigate = useNavigate();

  // 이전 페이지에서 받은 장소 이름 (예: 'drone_zone')
  const targetLocation = location.state?.targetLocation; 
  const qrImage = QR_MAP[targetLocation];

  const [statusText, setStatusText] = useState("안내를 준비하고 있습니다...");

  useEffect(() => {
    const startTemiMove = async () => {
      if (!targetLocation) {
        setStatusText("목적지 정보가 없습니다.");
        return;
      }

      try {
        setStatusText(`'${targetLocation}'(으)로 이동합니다! 🚀`);

        // 👇 [핵심] TemiMove 플러그인을 통해 이동 명령 전송
        if (TemiMove) {
          await TemiMove.goTo({ location: targetLocation });
          console.log(`${targetLocation} 이동 명령 전송 성공`);
        } else {
          console.warn("TemiMove 플러그인을 찾을 수 없습니다.");
        }

      } catch (error) {
        console.error("테미 이동 에러:", error);
        setStatusText("로봇 연결 상태를 확인해주세요.");
      }
    };

    startTemiMove();
  }, [targetLocation]);

  return (
    <main
      style={{
        width: "1900px",
        height: "1200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // 배경 이미지는 님 프로젝트 경로에 맞게 설정되어 있다고 가정
        background: `url("src/assets/테미길안내/테미길안내중.png")`,
        backgroundSize: "cover",
        fontFamily: "nanumRound",
        position: "relative"
      }}
    >
      <div style={{ 
        position:"absolute",
        width:"1465px",
        top:"130px", left:"47px",
        padding: "40px 60px",
        borderRadius: "20px",
        textAlign: "center"
      }}>
        <h1 style={{ margin: 0, fontSize: "50px" }}>{statusText}</h1>
        <p style={{ marginTop: "12px", fontSize: "30px", opacity: 0.7 }}>
          가는 동안 큐알로 미리 줄 서는 건 어때요?
        </p>

        <button 
          onClick={() => navigate(-1)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "40px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontFamily: "nanumRound",
            cursor: "pointer"
          }}
        >
          뒤로 가기
        </button>
      </div>

      {/* QR 코드 표시 영역 */}
      {qrImage && (
        <img
          src={qrImage}
          alt="QR 코드"
          style={{
            position: "absolute",
            right: "180px",
            bottom: "430px",
            width: "400px",
            height: "400px"
          }}
        />
      )}
    </main>
  );
}