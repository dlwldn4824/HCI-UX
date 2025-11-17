import React, { useRef, useEffect, useState } from "react";
import "../styles/PhotoFilter.css";
import filter1 from "../assets/photo/filter_overlay1.png";
import filter2 from "../assets/photo/filter_overlay2.png";
import filter3 from "../assets/photo/filter_overlay3.png";
import { useNavigate } from "react-router-dom";

export default function PhotoFilter() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [streaming, setStreaming] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filter1);
  const [loading, setLoading] = useState(false);   // ⭐ 스피너 상태 추가

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

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
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

  const getUploadUrl = async () => {
    const res = await fetch("/api/photo/upload?key=1");
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
    const res = await fetch("/api/photo/download?key=1");
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
      setLoading(true);  // ⭐ 스피너 ON

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

  const filters = [filter1, filter2, filter3];

  // ⭐ 로딩 중이면 스피너 전용 화면 보여주기
  if (loading) {
    return (
      <main className="photo-filter-wrap">
        <div className="spinner"></div>
      </main>
    );
  }

  return (
    <main className="photo-filter-wrap">
      <video ref={videoRef} autoPlay playsInline muted className="camera-view" />

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
          padding: "00px 40px",
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
