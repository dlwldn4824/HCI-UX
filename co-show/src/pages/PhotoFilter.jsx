// src/pages/PhotoFilter.jsx
import React, { useRef, useEffect, useState } from "react";
import "../styles/PhotoFilter.css";
import temiSpinner from "../assets/스피너/테미_스피너.png";

import filter1 from "../assets/photo/filter_overlay1.png";
import filter2 from "../assets/photo/filter_overlay2.png";
import filter3 from "../assets/photo/filter_overlay3.png";
import filter4 from "../assets/photo/우주필터.png";
import filter5 from "../assets/photo/트로피필터.png";

import { useNavigate } from "react-router-dom";

const UPLOAD_ENDPOINT = "https://tellme-api.kwidea.com/upload-photo"; 
// 👉 백엔드에서 실제로 만든 업로드 API 경로에 맞게 수정

export default function PhotoFilter() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [streaming, setStreaming] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filter1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert("이 기기에서는 카메라를 사용할 수 없습니다.");
          console.error("mediaDevices/getUserMedia not supported", navigator);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (err) {
        console.error("getUserMedia error:", err.name, err.message, err);
        alert("카메라 접근 실패 (" + err.name + "): " + err.message);
      }
    }

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 캔버스에 카메라 이미지 + 오버레이 필터 합성 → Blob 반환
  const captureImageData = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = videoRef.current;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      const img = new Image();
      img.src = selectedFilter;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
    });
  };

  // 🔥 새 방식: 이미지 Blob → 백엔드로 업로드 → URL 받아오기
  const uploadImageAndGetUrl = async (blob) => {
    const formData = new FormData();

    // ⚠️ 백엔드에서 기대하는 필드 이름(예: "file" / "photo" 등)에 맞춰 수정
    formData.append("file", blob, "photo.png");

    const res = await fetch(UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "이미지 업로드 실패");
    }

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("서버 응답을 JSON으로 파싱하지 못했어요.");
    }

    if (!data || !data.url) {
      throw new Error("서버 응답에 url 필드가 없습니다.");
    }

    return data.url;
  };

  const handleCapture = async () => {
    try {
      setLoading(true);

      // 1. 사진 + 필터 합성해서 Blob 획득
      const imageBlob = await captureImageData();

      // 2. 서버에 업로드하고 업로드된 이미지 URL 받기
      const imageUrl = await uploadImageAndGetUrl(imageBlob);
      console.log("✅ 업로드된 이미지 URL:", imageUrl);

      // 3. 이후 QR 페이지에서 이 URL을 대상으로 QR 생성하게 localStorage에 저장
      localStorage.setItem("photoUrl", imageUrl);

      // 4. QR 페이지로 이동
      navigate("/photo/qr");
    } catch (err) {
      console.error("❌ 에러:", err);
      alert("오류: " + err.message);
      setLoading(false);
    }
  };

  const filters = [filter1, filter2, filter3, filter4, filter5];

  if (loading) {
    return (
      <main className="photo-filter-wrap photo-filter-loading">
        <div className="robot-spinner">
          <img src={temiSpinner} alt="loading robot" className="robot-img" />
          <div className="dot-ring">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="dot" style={{ "--i": i }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="photo-filter-wrap">
      {/* 🔙 왼쪽 위 뒤로가기 버튼 */}
      <button className="photo-back-btn" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-view"
      />

      {streaming && (
        <img src={selectedFilter} alt="filter" className="filter-overlay" />
      )}

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: "none" }}
      />

      <div className="filter-bar">
        {filters.map((f, i) => (
          <button
            key={i}
            className={`filter-option ${
              selectedFilter === f ? "active" : ""
            }`}
            onClick={() => setSelectedFilter(f)}
          >
            <img src={f} alt={`filter ${i + 1}`} />
          </button>
        ))}
      </div>

      <button
        className="capture-btn"
        onClick={handleCapture}
        style={{
          fontSize: "32px",
          padding: "0px 40px",
          width: "300px",
          height: "80px",
          borderRadius: "20px",
          fontWeight: "700",
        }}
      >
        촬영하기
      </button>
    </main>
  );
}
