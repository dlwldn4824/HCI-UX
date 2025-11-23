// /pages/QuizCorrect.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Capacitor } from '@capacitor/core';
import "../styles/subquizs.css";

const { TemiControl } = Capacitor.Plugins;

// 문제별 정답 영상 매핑 (1, 2번만)
const CORRECT_VIDEO_MAP = {
  "1": "src/assets/퀴즈영상/테미_춤_정답.mov",
  "2": "src/assets/퀴즈영상/테미_목소리_정답.mov",
};

export default function QuizCorrect() {
  const { qid } = useParams();
  const navigate = useNavigate();

  const hasVideo = CORRECT_VIDEO_MAP[qid] != null;
  const [showVideo, setShowVideo] = useState(hasVideo);

  const [statusText, setStatusText] = useState("");

  // qid / hasVideo 바뀔 때마다 showVideo 초기화
  useEffect(() => {
    setShowVideo(hasVideo);
  }, [qid, hasVideo]);

  // 정답 페이지용 body 클래스
  useEffect(() => {
    document.body.classList.add("quiz-correct-route", `qz-q${qid}`);
    return () =>
      document.body.classList.remove("quiz-correct-route", `qz-q${qid}`);
  }, [qid]);

  // 영상 재생 중엔 헤더 숨김
  useEffect(() => {
    if (showVideo && hasVideo) {
      document.body.classList.add("video-open");
    } else {
      document.body.classList.remove("video-open");
    }
    return () => document.body.classList.remove("video-open");
  }, [showVideo, hasVideo]);

  // 🔥 10초 뒤 영상 자동 종료 (영상 있는 문제에만)
  useEffect(() => {
    if (!hasVideo) return;
    if (!showVideo) return;

    const timer = setTimeout(() => setShowVideo(false), 10000);
    return () => clearTimeout(timer);
  }, [qid, showVideo, hasVideo]);

  // 🔥 showVideo 상태에 맞춰 춤 시작/멈춤 (1번 문제만)
  useEffect(() => {
    if (qid !== "1") return;

    // 영상이 보이는 동안 → 춤 시작
    if (showVideo) {
      setStatusText("테미가 춤추는 중입니다! 💃");
      if (TemiControl?.dance) {
        TemiControl.dance().catch(err => console.error("dance error:", err));
      }
    } else {
      // 영상이 꺼지면 → 춤 멈춤
      setStatusText("");
      if (TemiControl?.stopDance) {
        TemiControl.stopDance().catch(err => console.error("stopDance error:", err));
      }
    }

    // 컴포넌트 unmount 시에도 안전하게 멈추기
    return () => {
      if (qid === "1" && TemiControl?.stopDance) {
        TemiControl.stopDance().catch(() => {});
      }
    };
  }, [qid, showVideo]);

  const handleNext = () => {
    const current = Number(qid);
    if (current < 3) navigate(`/quiz/${current + 1}`);
    else navigate("/events/complete");
  };

  const videoSrc = CORRECT_VIDEO_MAP[qid];

  return (
    <main className="qz-page">
      {/* 춤추는 상태 문구 (1번만) */}
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

      {hasVideo && showVideo && (
        <div className="video-overlay">
          <button
            className="video-close-btn"
            onClick={() => setShowVideo(false)}
          >
            ×
          </button>

          <video
            src={videoSrc}
            autoPlay
            playsInline
            muted={false}
            onEnded={() => setShowVideo(false)}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      {(!hasVideo || !showVideo) && (
        <div className={`qz-result qz-q${qid}`}>
          <div className="qz-result-text qz-correct-text" />
          <button className="qz-next-btn" onClick={handleNext} />
        </div>
      )}
    </main>
  );
}
