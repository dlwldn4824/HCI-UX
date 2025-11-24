// /pages/QuizCorrect.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import "../styles/subquizs.css";

import temiSpinner from "../assets/스피너/테미_스피너.png";

const { TemiControl } = Capacitor.Plugins;

// YouTube 영상 ID
const CORRECT_YT_MAP = {
  "1": "f5vZP6zc54Y",
  "2": "MAiImAGr9bc",
};

export default function QuizCorrect() {
  const { qid } = useParams();
  const navigate = useNavigate();

  const ytId = CORRECT_YT_MAP[qid];
  const hasVideo = !!ytId;

  const [showVideo, setShowVideo] = useState(hasVideo);
  const [videoLoaded, setVideoLoaded] = useState(false); // 🔥 iframe 로딩 여부
  const [statusText, setStatusText] = useState("");

  // qid 바뀌면 초기화
  useEffect(() => {
    setShowVideo(hasVideo);
    setVideoLoaded(false);
  }, [qid, hasVideo]);

  // body class
  useEffect(() => {
    document.body.classList.add("quiz-correct-route", `qz-q${qid}`);
    return () =>
      document.body.classList.remove("quiz-correct-route", `qz-q${qid}`);
  }, [qid]);

  // showVideo 동안 헤더 숨김
  useEffect(() => {
    if (showVideo && hasVideo) document.body.classList.add("video-open");
    else document.body.classList.remove("video-open");
  }, [showVideo, hasVideo]);

  // 🔥 영상 로딩 후 10초 뒤 닫기
  useEffect(() => {
    if (!hasVideo) return;
    if (!showVideo) return;
    if (!videoLoaded) return; // ← 로딩 완료 후 카운트 시작

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

  const youtubeSrc = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&controls=0&rel=0&playsinline=1`
    : null;

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

      {/* 영상 표시 */}
      {hasVideo && showVideo && (
        <div className="video-overlay">
          <button className="video-close-btn" onClick={() => setShowVideo(false)}>
            ×
          </button>

          {/* 🔥 로딩 스피너 */}
          {!videoLoaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgb(255, 255, 255)",
                zIndex: 5,
              }}
            >
              <img
                src={temiSpinner}
                alt="loading"
                style={{ width: "200px", height: "200px", opacity: 0.9 }}
              />
            </div>
          )}

          {/* iframe (로딩되면 보여짐) */}
          <iframe
            src={youtubeSrc}
            title="정답 영상"
            onLoad={() => setVideoLoaded(true)} // 🔥 로딩 완료
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              opacity: videoLoaded ? 1 : 0, // 로딩 전 숨김
              transition: "opacity 0.4s",
            }}
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>
      )}

      {/* 영상 끝나면 원래 정답 UI */}
      {(!hasVideo || !showVideo) && (
        <div className={`qz-result qz-q${qid}`}>
          <div className="qz-result-text qz-correct-text" />
          <button className="qz-next-btn" onClick={handleNext} />
        </div>
      )}
    </main>
  );
}
