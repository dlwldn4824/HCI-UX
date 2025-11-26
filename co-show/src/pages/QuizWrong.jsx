// src/pages/QuizWrong.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/subquizs.css";
import temiSpinner from "../assets/스피너/테미_스피너.png";

// 🔥 오답 영상 Supabase Storage URL
const WRONG_VIDEO_MAP = {
  "1": "https://fxymkjkckqsgxdzbhcxl.supabase.co/storage/v1/object/public/videos/dance_wrong.mp4",
  "2": "https://fxymkjkckqsgxdzbhcxl.supabase.co/storage/v1/object/public/videos/voice_wrong.mp4",
};

export default function QuizWrong() {
  const { qid } = useParams();
  const navigate = useNavigate();

  // 🔥 이 문제(qid)에 오답 영상이 있는지 여부
  const hasVideo = WRONG_VIDEO_MAP[qid] != null;

  // 🔥 영상 팝업 제어 상태 (영상이 있는 문제만 true로 시작)
  const [showVideo, setShowVideo] = useState(hasVideo);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  // qid가 바뀔 때마다 showVideo 초기화
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

  // 🔥 body에 문제별 클래스 추가
  useEffect(() => {
    document.body.classList.add("quiz-wrong-route", `qz-q${qid}`);
    return () => {
      document.body.classList.remove("quiz-wrong-route", `qz-q${qid}`);
    };
  }, [qid]);

  // 🔥 showVideo 에 따라 body에 video-open 클래스 토글 → 헤더 숨길 때 사용
  useEffect(() => {
    if (showVideo && hasVideo) {
      document.body.classList.add("video-open");
    } else {
      document.body.classList.remove("video-open");
    }
    return () => document.body.classList.remove("video-open");
  }, [showVideo, hasVideo]);

  // 🔥 10초 뒤 영상 자동 종료 (영상 있는 문제에만 적용)
  useEffect(() => {
    if (!hasVideo) return;     // Q3 등은 타이머 안 걸기
    if (!showVideo) return;

    const timer = setTimeout(() => setShowVideo(false), 10000); // 10초
    return () => clearTimeout(timer);
  }, [qid, hasVideo, showVideo]);

  const videoSrc = WRONG_VIDEO_MAP[qid];

  return (
    <main className="qz-page">
      {/* 🔥 영상 팝업 (Q1, Q2 오답일 때만) */}
      {hasVideo && showVideo && (
        <div className="video-overlay">
          {/* ✖ 닫기 버튼 */}
          <button
            className="video-close-btn"
            onClick={() => setShowVideo(false)}>
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

          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted={false}
            playsInline
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
              inset: 0,            // top/right/bottom/left: 0 과 같음
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,           // 버튼보다 아래
              pointerEvents: "none", // 클릭은 비디오가 아니라 버튼/오버레이로
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

      {/* 🔥 영상이 없거나, 닫힌 후에만 본래 화면 표시 */}
      {(!hasVideo || !showVideo) && (
        <div className={`qz-wrong qz-q${qid}`}>
          <div className="qz-result-text qz-wrong-text" />

          {qid === "3" ? (
            <button
              className="qz-photo-btn"
              onClick={() => navigate("/photo")}
            />
          ) : (
            <button
              className="qz-retry-btn"
              onClick={() => navigate(`/quiz/${qid}`)}
            />
          )}

          <button
            className="qz-explain-btn"
            onClick={() => navigate(`/quiz/${qid}/result`)}
          />
        </div>
      )}
    </main>
  );
}
