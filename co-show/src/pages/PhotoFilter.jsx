import React, { useRef, useEffect, useState } from "react";
import "../styles/PhotoFilter.css";
import temiSpinner from "../assets/스피너/테미_스피너.png";

import filter1 from "../assets/photo/filter_overlay1.png";
import filter2 from "../assets/photo/filter_overlay2.png";
import filter3 from "../assets/photo/filter_overlay3.png";
import filter4 from "../assets/photo/우주필터.png";
import filter5 from "../assets/photo/트로피필터.png";
import filter6 from "../assets/photo/부기필터.png";
import filter7 from "../assets/photo/인스타필터.png";

import { useNavigate } from "react-router-dom";

export default function PhotoFilter() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [streaming, setStreaming] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filter1);
  const [loading, setLoading] = useState(false); // 스피너 상태 추가

  useEffect(() => {
  async function initCamera() {
    try {
      // 1) 이 환경에서 카메라 API 지원하는지 먼저 체크
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("이 기기에서는 카메라를 사용할 수 없습니다.");
        console.error("mediaDevices/getUserMedia not supported", navigator);
        return;
      }

      // 2) 카메라 요청 (전면 카메라 선호)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false, // 필요 없으면 명시해줘도 OK
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

  // QR 서버 URL 가져오기 (환경 변수 또는 기본값)
  // 프로덕션에서는 Vercel 프록시를 통해 HTTPS로 접근
  // 개발 환경에서는 직접 HTTP 서버에 접근
  const getQrServerUrl = () => {
    // 환경 변수가 있으면 사용
    const envUrl = import.meta?.env?.VITE_PHOTO_UPLOAD_URL;
    if (envUrl) return envUrl;
    
    // 프로덕션 환경 (HTTPS)에서는 Vercel 프록시 경로 사용
    if (window.location.protocol === 'https:' || import.meta.env.PROD) {
      return ''; // 상대 경로 사용 (Vercel 프록시 통해)
    }
    
    // 개발 환경에서는 직접 HTTP 서버 접근
    return "http://44.198.30.193:8080";
  };

  const getUploadUrl = async () => {
    const baseUrl = getQrServerUrl();
    const url = baseUrl ? `${baseUrl}/photo/upload?key=1` : '/api/photo/upload?key=1';
    const res = await fetch(url);
    if (!res.ok) throw new Error("업로드 URL 요청 실패");
    return res.text();
  };

  const uploadToServer = async (url, blob) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "image/png" },
      body: blob,
    });

    if (!res.ok) throw new Error("이미지 업로드 실패");
  };

  const fetchQrImage = async () => {
    const baseUrl = getQrServerUrl();
    const url = baseUrl ? `${baseUrl}/photo/download?key=1` : '/api/photo/download?key=1';
    const res = await fetch(url);
    if (!res.ok) throw new Error("QR 요청 실패");

    const blob = await res.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const handleCapture = async () => {
    try {
      setLoading(true); // 스피너 ON

      const imageBlob = await captureImageData();
      const uploadUrl = await getUploadUrl();
      await uploadToServer(uploadUrl, imageBlob);

      const qrBase64 = await fetchQrImage();
      localStorage.setItem("qrUrl", qrBase64);

      navigate("/photo/qr");
    } catch (err) {
      alert("오류: " + err.message);
      console.error(err);
      setLoading(false);
    }
  };

  const filters = [filter1, filter2, filter3, filter4, filter5, filter6, filter7];

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
      <button
        className="photo-back-btn"
        onClick={() => navigate(-1)}
      >
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
            className={`filter-option ${selectedFilter === f ? "active" : ""}`}
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
