import React, { useRef, useEffect, useState } from "react";
import "../styles/PhotoFilter.css";
import temiSpinner from "../assets/스피너/테미_스피너.png";

import filter1 from "../assets/photo/filter_overlay1.png";
import filter2 from "../assets/photo/filter_overlay2.png";
import filter3 from "../assets/photo/filter_overlay3.png";
import filter4 from "../assets/photo/우주필터.png";
import filter5 from "../assets/photo/트로피필터.png";

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

  // Vercel 프록시 경로 사용 (HTTPS 환경에서 Mixed Content 문제 해결)
  // 프록시 함수: /api/photo/upload.js, /api/photo/download.js, /api/photo/upload-put.js
  // vercel.config의 rewrites를 통해 /photo/* → /api/photo/*로 라우팅됨

  // 업로드 URL 가져오기 (presigned URL)
  const getUploadUrl = async (key = "1") => {
    const res = await fetch(`/photo/upload?key=${key}`);
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => "업로드 URL 요청 실패");
      throw new Error(errorText || "업로드 URL 가져오기 실패");
    }

    const uploadUrl = await res.text();
    return uploadUrl.trim();
  };

  // 이미지를 presigned URL로 업로드
  const uploadImageToServer = async (blob, uploadUrl) => {
    // Presigned URL이 HTTP인 경우 프록시를 통해 업로드 (Mixed Content 방지)
    // HTTPS인 경우 직접 업로드
    if (uploadUrl.startsWith('http://')) {
      // HTTP presigned URL은 프록시를 통해 업로드
      const encodedUrl = encodeURIComponent(uploadUrl);
      const res = await fetch(`/photo/upload-put?url=${encodedUrl}`, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": "image/png",
        },
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "업로드 실패");
        throw new Error(errorText || "이미지 업로드 실패");
      }
    } else {
      // HTTPS presigned URL은 직접 업로드
      const res = await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": "image/png",
        },
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "업로드 실패");
        throw new Error(errorText || "이미지 업로드 실패");
      }
    }
  };

  // QR 코드 이미지 다운로드
  const downloadQRCode = async (key = "1") => {
    const res = await fetch(`/photo/download?key=${key}`);
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => "QR 코드 다운로드 실패");
      throw new Error(errorText || "QR 코드 다운로드 실패");
    }

    // 이미지를 Blob으로 변환한 후 Base64로 변환
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleCapture = async () => {
    try {
      setLoading(true); // 스피너 ON

      // 1. 이미지 캡처
      const imageBlob = await captureImageData();

      // 2. 업로드 URL 가져오기
      const uploadUrl = await getUploadUrl("1");
      console.log("📤 업로드 URL:", uploadUrl);

      // 3. 이미지를 서버에 업로드
      await uploadImageToServer(imageBlob, uploadUrl);
      console.log("✅ 이미지 업로드 완료");

      // 4. QR 코드 다운로드
      const qrBase64 = await downloadQRCode("1");
      console.log("✅ QR 코드 다운로드 완료");

      // 5. QR 코드를 localStorage에 저장
      localStorage.setItem("qrUrl", qrBase64);

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
