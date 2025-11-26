import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// QR 이미지 매핑
const QR_MAP = {
  "경주로봇 만들기": "src/assets/지능형로봇 QR코드/경주로봇 만들기.png",
  "로봇아 멍멍해봐": "src/assets/지능형로봇 QR코드/로봇아 멍멍해봐 4족보행로봇 활용 체험.png",
  "유선 스파이더로봇 만들기": "src/assets/지능형로봇 QR코드/유선 스파이더로봇 만들기.png",
  "자이로 외발주행로봇 만들기": "src/assets/지능형로봇 QR코드/자이로 외발주행로봇 만들기.png",
  "청소로봇 만들기": "src/assets/지능형로봇 QR코드/청소로봇 만들기.png",
  "휴머노이드 이론교육 및 미션수행": "src/assets/지능형로봇 QR코드/휴머노이드 이론교육 및 미션수행.png",
  "AI 드론 및 로봇 오목 로봇 체험": "src/assets/지능형로봇 QR코드/AI 드로잉 로봇 및 오목 로봇 체험.png",
  "ROBO SHOW": "src/assets/지능형로봇 QR코드/ROBO SHOW.png",
};

export default function TemiGuide() {
  const location = useLocation();
  const navigate = useNavigate();

  const targetLocation = location.state?.targetLocation; 
  const qrImage = QR_MAP[targetLocation];

  const [statusText, setStatusText] = useState("안내를 준비하고 있습니다...");

  useEffect(() => {
    const startTemiMove = () => {
      if (!targetLocation) {
        setStatusText("목적지 정보가 없습니다.");
        return;
      }

      // 화면에는 항상 선택한 체험 존으로 이동한다고 표시
      setStatusText(`'${targetLocation}'(으)로 이동합니다!`);

      try {
        // 실제로는 항상 지능형로봇 존으로 이동
        const actualDestination = "지능형로봇";
        
        // 항상 콘솔에 이동 정보 출력
        console.log(`📍 로봇 이동 명령:`);
        console.log(`   - 화면 표시: ${targetLocation}`);
        console.log(`   - 실제 이동: ${actualDestination}`);
        
        // window.temi.goTo 함수 사용
        if (window.temi && typeof window.temi.goTo === 'function') {
          window.temi.goTo(actualDestination);
          console.log(`   ✅ 로봇 이동 명령 전송 성공`);
        } else {
          console.warn(`   ⚠️ window.temi.goTo 함수를 사용할 수 없습니다. Android WebView에서 실행 중인지 확인하세요.`);
          console.log(`   📝 (로봇 연결 안됨) 이동할 위치: ${actualDestination}`);
          // window.temi가 없어도 화면에는 존 이름을 유지
        }

      } catch (error) {
        console.error("❌ 테미 이동 에러:", error);
        console.log(`   📝 (에러 발생) 이동할 위치: ${actualDestination}`);
        // 에러가 나도 화면에는 존 이름을 유지
      }
    };

    startTemiMove();
  }, [targetLocation]);

  return (
    <main
      style={{
        width: "1920px",
        height: "1200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        {/* QR 이미지가 있을 때만 문구 표시 */}
        {qrImage && (
          <p style={{ marginTop: "12px", fontSize: "30px", opacity: 0.7 }}>
            가는 동안 큐알로 미리 줄 서는 건 어때요?
          </p>
        )}

        <button 
          onClick={() => navigate(-1)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "40px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontFamily: "nanumRound"
          }}
        >
          뒤로 가기
        </button>
      </div>

      {/* 🔽 여기가 QR 표시 부분 */}
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
