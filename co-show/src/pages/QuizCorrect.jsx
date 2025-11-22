// /pages/QuizCorrect.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/subquizs.css";

// 🔥 문제별 정답 영상 매핑 (1, 2번만)
const CORRECT_VIDEO_MAP = {
  "1": "src/assets/퀴즈영상/테미_춤_정답.mp4",
  "2": "src/assets/퀴즈영상/테미_목소리_정답.mp4",
  // 3번은 영상 없음
};

export default function QuizCorrect() {
  const { qid } = useParams();
  const navigate = useNavigate();

  // 이 문제에 정답 영상이 있는지 여부
  const hasVideo = CORRECT_VIDEO_MAP[qid] != null;

  // 영상 팝업 상태
  const [showVideo, setShowVideo] = useState(hasVideo);

  // qid 변경 시 showVideo 재설정
  useEffect(() => {
    setShowVideo(hasVideo);
  }, [qid, hasVideo]);

  // body 클래스 적용 (정답 페이지용)
  useEffect(() => {
    document.body.classList.add("quiz-correct-route", `qz-q${qid}`);
    return () =>
      document.body.classList.remove("quiz-correct-route", `qz-q${qid}`);
  }, [qid]);

  // 영상 재생 중 헤더 숨기기
  useEffect(() => {
    if (showVideo && hasVideo) {
      document.body.classList.add("video-open");
    } else {
      document.body.classList.remove("video-open");
    }
    return () => document.body.classList.remove("video-open");
  }, [showVideo, hasVideo]);

  // 10초 뒤 자동 종료 (영상 있는 문제만)
  useEffect(() => {
    if (!hasVideo) return;
    if (!showVideo) return;

    const timer = setTimeout(() => setShowVideo(false), 10000);
    return () => clearTimeout(timer);
  }, [qid, showVideo, hasVideo]);

  // 다음 문제 이동
  const handleNext = () => {
    const current = Number(qid);
    if (current < 3) {
      navigate(`/quiz/${current + 1}`);
    } else {
      navigate("/events/complete");
    }
  };

  const videoSrc = CORRECT_VIDEO_MAP[qid];

  return (
    <main className="qz-page">
      {/* 🔥 영상 팝업 */}
      {hasVideo && showVideo && (
        <div className="video-overlay">
          <button className="video-close-btn" onClick={() => setShowVideo(false)}>
            ×
          </button>

          <video
            src={videoSrc}
            autoPlay
            playsInline
            muted={false}
            onEnded={() => setShowVideo(false)}
            style={{ width: "1920px", height: "1200px" }}
          />
        </div>
      )}

      {/* 🔥 영상이 없거나 닫힌 뒤 나타나는 정답 화면 */}
      {(!hasVideo || !showVideo) && (
        <div className={`qz-result qz-q${qid}`}>
          <div className="qz-result-text qz-correct-text" />
          <button className="qz-next-btn" onClick={handleNext} />
        </div>
      )}
    </main>
  );
}
