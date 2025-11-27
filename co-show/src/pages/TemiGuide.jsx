import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/subquizs.css";
import temiSpinner from "../assets/스피너/테미_스피너.png";

// 길 안내 영상 URL
const GUIDE_VIDEO_URL = "https://fxymkjkckqsgxdzbhcxl.supabase.co/storage/v1/object/public/videos/follow.mov";

// 배경 이미지 import
import temiGuideBg from "../assets/테미길안내/테미길안내중.png";

// QR 이미지 import
import qr1 from "../assets/지능형로봇 QR코드/경주로봇 만들기.png";
import qr2 from "../assets/지능형로봇 QR코드/로봇아 멍멍해봐 4족보행로봇 활용 체험.png";
import qr3 from "../assets/지능형로봇 QR코드/유선 스파이더로봇 만들기.png";
import qr4 from "../assets/지능형로봇 QR코드/자이로 외발주행로봇 만들기.png";
import qr5 from "../assets/지능형로봇 QR코드/청소로봇 만들기.png";
import qr6 from "../assets/지능형로봇 QR코드/휴머노이드 이론교육 및 미션수행.png";
import qr7 from "../assets/지능형로봇 QR코드/AI 드로잉 로봇 및 오목 로봇 체험.png";
import qr8 from "../assets/지능형로봇 QR코드/ROBO SHOW.png";

// QR 이미지 매핑
const QR_MAP = {
  "경주로봇 만들기": qr1,
  "로봇아 멍멍해봐": qr2,
  "유선 스파이더로봇 만들기": qr3,
  "자이로 외발주행로봇 만들기": qr4,
  "청소로봇 만들기": qr5,
  "휴머노이드 이론교육 및 미션수행": qr6,
  "AI 드론 및 로봇 오목 로봇 체험": qr7,
  "ROBO SHOW": qr8,
};

export default function TemiGuide() {
  const location = useLocation();
  const navigate = useNavigate();

  const targetLocation = location.state?.targetLocation; 
  const qrImage = QR_MAP[targetLocation];

  const [statusText, setStatusText] = useState("안내를 준비하고 있습니다...");
  const [showVideo, setShowVideo] = useState(true); // 길 안내 시작 시 영상 표시
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  // 비디오 로드 타임아웃 (10초)
  useEffect(() => {
    if (!showVideo) return;
    
    const timeout = setTimeout(() => {
      if (!videoLoaded && !videoError) {
        console.warn("비디오 로드 타임아웃");
        setVideoError(true);
        setShowVideo(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [showVideo, videoLoaded, videoError]);

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
        background: `url("${temiGuideBg}")`,
        backgroundSize: "cover",
        fontFamily: "nanumRound",
        position: "relative"
      }}
    >
      {/* 🔥 길 안내 영상 재생 */}
      {showVideo && (
        <div className="video-overlay">
          <button
            className="video-close-btn"
            onClick={() => setShowVideo(false)}
          >
            ×
          </button>

          {/* 로딩 스피너 */}
          {!videoLoaded && !videoError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff",
                zIndex: 5,
              }}
            >
              <div className="robot-spinner">
                <img src={temiSpinner} alt="loading robot" className="robot-img" />
                <div className="dot-ring">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="dot" style={{ "--i": i }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 비디오 */}
          <video
            ref={videoRef}
            src={GUIDE_VIDEO_URL}
            autoPlay
            playsInline
            muted={false}
            preload="auto"
            onCanPlay={() => {
              setVideoLoaded(true);
              setVideoError(false);
            }}
            onError={(e) => {
              console.error("비디오 로드 에러:", e);
              setVideoError(true);
              setVideoLoaded(false);
              // 에러 발생 시 3초 후 자동으로 닫기
              setTimeout(() => setShowVideo(false), 3000);
            }}
            onEnded={() => setShowVideo(false)} // 영상 끝나면 닫힘
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
              pointerEvents: "none",
              opacity: videoLoaded ? 1 : 0,
              transition: "opacity 0.4s",
            }}
          />

          {/* 비디오 에러 표시 */}
          {videoError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.8)",
                color: "#fff",
                zIndex: 10,
                padding: "40px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "30px", marginBottom: "20px" }}>
                영상을 불러올 수 없습니다
              </p>
              <p style={{ fontSize: "20px", opacity: 0.8 }}>
                네트워크 연결을 확인해주세요
              </p>
              <button
                onClick={() => setShowVideo(false)}
                style={{
                  marginTop: "30px",
                  padding: "15px 30px",
                  fontSize: "20px",
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                닫기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 영상이 끝나거나 닫힌 후 기본 화면 표시 */}
      {!showVideo && (
        <>
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
        </>
      )}
    </main>
  );
}
