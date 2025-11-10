import React, { useRef, useEffect, useState } from "react";
import "../styles/PhotoFilter.css";
import filter1 from "../assets/photo/filter_overlay1.png";
import filter2 from "../assets/photo/filter_overlay2.png";
import filter3 from "../assets/photo/filter_overlay3.png";

export default function PhotoFilter() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filter1);

  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (err) {
        alert("카메라 접근 실패: " + err.message);
      }
    }

    initCamera();

    // ✅ 페이지 나갈 때 카메라 종료
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    // 📸 비디오 프레임 그리기
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 🎨 선택된 필터 합성
    const filterImg = new Image();
    filterImg.src = selectedFilter;
    filterImg.onload = () => {
      ctx.drawImage(filterImg, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.download = "photo_with_filter.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  const filters = [filter1, filter2, filter3];

  return (
    <main className="photo-filter-wrap">
      {/* 카메라 */}
      <video ref={videoRef} autoPlay playsInline muted className="camera-view" />

      {/* 현재 선택된 필터 */}
      {streaming && (
        <img src={selectedFilter} alt="filter" className="filter-overlay" />
      )}

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: "none" }}
      />

      {/* 🎨 필터 선택 바 */}
      <div className="filter-bar">
        {filters.map((f, i) => (
          <button
            key={i}
            className={`filter-option ${selectedFilter === f ? "active" : ""}`}
            onClick={() => setSelectedFilter(f)}
          >
            <img src={f} alt={`filter ${i + 1}`} />
          </button>
        ))}
      </div>

      {/* 촬영 버튼 */}
      <button className="capture-btn" onClick={handleCapture}>
        📸 촬영하기
      </button>
    </main>
  );
}
