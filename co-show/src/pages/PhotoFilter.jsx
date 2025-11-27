import React, { useRef, useEffect, useState } from "react";
import "../styles/PhotoFilter.css";
import temiSpinner from "../assets/스피너/테미_스피너.png";
import QRCode from "qrcode";

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


  // 이미지 압축 및 리사이즈 함수
  const compressImage = (base64, maxWidth = 400, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // 리사이즈할 캔버스 생성
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 비율 유지하면서 리사이즈
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // JPEG로 압축 (PNG보다 작음)
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        console.log(`📦 이미지 압축: ${(base64.length / 1024).toFixed(2)}KB → ${(compressedBase64.length / 1024).toFixed(2)}KB`);
        resolve(compressedBase64);
      };
      img.src = base64;
    });
  };

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
        // Base64로 변환하여 반환
        const base64 = canvas.toDataURL("image/png");
        resolve(base64);
      };
    });
  };

  // 클라이언트 사이드에서 QR 코드 생성
  const generateQRCode = async (imageBase64) => {
    try {
      // 이미지 압축 (QR 코드에 담을 수 있도록)
      console.log('📦 이미지 압축 중...');
      const compressedImage = await compressImage(imageBase64, 300, 0.6);
      
      // 압축된 이미지의 Base64 데이터를 QR 코드로 생성
      console.log('🔲 QR 코드 생성 중...');
      const qrCodeDataUrl = await QRCode.toDataURL(compressedImage, {
        width: 600,
        margin: 2,
        errorCorrectionLevel: 'H', // 높은 오류 정정 레벨 (데이터가 많을 때 유용)
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      console.log('✅ QR 코드 생성 완료');
      return qrCodeDataUrl;
    } catch (error) {
      console.error('❌ QR 코드 생성 에러:', error);
      
      // 데이터가 여전히 너무 큰 경우, 고유 ID 방식으로 대체
      if (error.message.includes('too big')) {
        console.log('⚠️ 이미지가 너무 커서 고유 ID 방식으로 전환');
        const uniqueId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // 원본 이미지를 localStorage에 저장
        localStorage.setItem(`photo_${uniqueId}`, imageBase64);
        // QR 코드에는 ID만 저장
        const qrCodeDataUrl = await QRCode.toDataURL(uniqueId, {
          width: 600,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        return qrCodeDataUrl;
      }
      
      throw new Error('QR 코드 생성 실패');
    }
  };

  // HTTP 서버 사용하지 않고 클라이언트에서 QR 코드 생성

  const handleCapture = async () => {
    try {
      setLoading(true); // 스피너 ON

      // 1. 사진 촬영 (Base64로 변환)
      console.log('📸 사진 촬영 중...');
      const imageBase64 = await captureImageData();
      console.log('✅ 사진 촬영 완료');

      // 2. 클라이언트에서 QR 코드 생성 (HTTP 서버 불필요)
      console.log('🔲 QR 코드 생성 중...');
      const qrCodeDataUrl = await generateQRCode(imageBase64);
      console.log('✅ QR 코드 생성 완료');

      // 3. QR 코드를 localStorage에 저장
      localStorage.setItem("qrUrl", qrCodeDataUrl);

      // 4. QR 코드 페이지로 이동
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
