// src/pages/QuizCorrect.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import "../styles/subquizs.css";

import temiSpinner from "../assets/스피너/테미_스피너.png";

const { TemiControl } = Capacitor.Plugins;

// 🔥 정답 영상 Supabase Storage URL
const CORRECT_VIDEO_MAP = {
  "1": "https://fxymkjkckqsgxdzbhcxl.supabase.co/storage/v1/object/public/videos/dance_correct.mp4",
  "2": "https://fxymkjkckqsgxdzbhcxl.supabase.co/storage/v1/object/public/videos/voice_correct.mp4",
};

export default function QuizCorrect() {
  const { qid } = useParams();
  const navigate = useNavigate();

  const videoSrc = CORRECT_VIDEO_MAP[qid];
  const hasVideo = !!videoSrc;

  const [showVideo, setShowVideo] = useState(hasVideo);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [statusText, setStatusText] = useState("");
  const videoRef = useRef(null);

  // qid 바뀌면 초기화
  useEffect(() => {
    setShowVideo(hasVideo);
    setVideoLoaded(false);
    setVideoError(false);
  }, [qid, hasVideo]);

  // 비디오 로드 타임아웃 (10초)
  useEffect(() => {
    if (!hasVideo || !showVideo) return;
    
    const timeout = setTimeout(() => {
      if (!videoLoaded && !videoError) {
        console.warn("비디오 로드 타임아웃");
        setVideoError(true);
        setShowVideo(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [hasVideo, showVideo, videoLoaded, videoError]);

  // body class
  useEffect(() => {
    document.body.classList.add("quiz-correct-route", `qz-q${qid}`);
    return () =>
      document.body.classList.remove("quiz-correct-route", `qz-q${qid}`);
  }, [qid]);

  // showVideo 시 헤더 숨김
  useEffect(() => {
    if (showVideo && hasVideo) document.body.classList.add("video-open");
    else document.body.classList.remove("video-open");
  }, [showVideo, hasVideo]);

  // 🔥 영상 로딩 완료 후 10초 뒤 자동 종료
  useEffect(() => {
    if (!hasVideo) return;
    if (!showVideo) return;
    if (!videoLoaded) return;

    const timer = setTimeout(() => setShowVideo(false), 10000);
    return () => clearTimeout(timer);
  }, [qid, showVideo, videoLoaded, hasVideo]);

  // 🔥 테미 춤 제어
  useEffect(() => {
    if (qid !== "1") return;

    if (showVideo && videoLoaded) {
      setStatusText("테미가 춤추는 중입니다! 💃");
      TemiControl?.dance?.().catch(() => {});
    } else {
      setStatusText("");
      TemiControl?.stopDance?.().catch(() => {});
    }

    return () => {
      TemiControl?.stopDance?.().catch(() => {});
    };
  }, [qid, showVideo, videoLoaded]);

  const handleNext = () => {
    const n = Number(qid);
    if (n < 3) navigate(`/quiz/${n + 1}`);
    else navigate("/events/complete");
  };

  return (
    <main className="qz-page">
      {/* 1번 문제: 상태 텍스트 출력 */}
      {qid === "1" && statusText && (
        <div
          style={{
            position: "absolute",
            top: "100px",
            left: "300px",
            color: "#fff",
            fontSize: "50px",
            fontWeight: "900",
            zIndex: 10,
          }}
        >
          {statusText}
        </div>
      )}

      {/* 🔥 mp4 영상 재생 */}
      {hasVideo && showVideo && (
        <div className="video-overlay">
          <button
            className="video-close-btn"
            onClick={() => setShowVideo(false)}
          >
            ×
          </button>

          {/* 로딩 스피너 */}
          {!videoLoaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#000000", // 검정 배경으로 초록색 화면 방지
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

          {/* mp4 비디오 */}
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            playsInline
            muted={false}
            preload="auto"
            onLoadedData={() => {
              // onLoadedData는 첫 프레임이 완전히 디코딩된 후 호출되어 더 안정적
              setVideoLoaded(true);
              setVideoError(false);
            }}
            onCanPlay={() => {
              // onCanPlay도 백업으로 유지
              if (!videoLoaded) {
                setVideoLoaded(true);
                setVideoError(false);
              }
            }}
            onError={(e) => {
              console.error("비디오 로드 에러:", e);
              setVideoError(true);
              setVideoLoaded(false);
              // 에러 발생 시 3초 후 자동으로 닫기
              setTimeout(() => setShowVideo(false), 3000);
            }}
            onEnded={() => setShowVideo(false)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "#000000", // 초록색 화면 대신 검정 배경 표시
              opacity: videoLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
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

      {/* 영상 종료 후 정답 UI */}
      {(!hasVideo || !showVideo) && (
        <div className={`qz-result qz-q${qid}`}>
          <div className="qz-result-text qz-correct-text" />
          <button className="qz-next-btn" onClick={handleNext} />
        </div>
      )}
    </main>
  );
}
