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

  // HTTPS 환경에서는 무조건 프록시 사용 (Mixed Content 방지)
  // HTTP 환경(로컬 개발)에서는 직접 접근
  const useProxy = () => {
    if (typeof window === 'undefined') return false;
    // HTTPS 페이지에서는 무조건 프록시 사용
    return window.location.protocol === 'https:';
  };

  // 1단계: presignedUrl 받기
  // GET /photo/upload?key={key} → response: presignedUrl (문자열)
  const getUploadUrl = async () => {
    try {
      // 프로덕션/HTTPS 환경에서는 프록시 사용
      const url = useProxy() 
        ? '/photo/upload?key=1'
        : 'http://44.198.30.193:8080/photo/upload?key=1';
      
      console.log('📤 1단계: presignedUrl 요청:', url);
      
      const res = await fetch(url);
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => '응답 텍스트를 읽을 수 없음');
        console.error('❌ presignedUrl 요청 실패:', {
          status: res.status,
          statusText: res.statusText,
          url: url,
          errorText: errorText
        });
        throw new Error(`presignedUrl 요청 실패 (${res.status} ${res.statusText}): ${errorText}`);
      }
      
      // presignedUrl 문자열 받기
      const presignedUrl = await res.text();
      console.log('✅ presignedUrl 획득:', presignedUrl);
      return presignedUrl;
    } catch (error) {
      console.error('❌ getUploadUrl 에러:', error);
      throw error;
    }
  };

  // 2단계: presignedUrl에 이미지 업로드
  // PUT {presignedUrl} → 이미지 업로드 완료
  const uploadToServer = async (presignedUrl, blob) => {
    try {
      console.log('📤 2단계: presignedUrl에 이미지 업로드 시작');
      console.log('   presignedUrl:', presignedUrl);
      
      let uploadUrl = presignedUrl;
      
      // HTTPS 환경이고 presignedUrl이 HTTP인 경우 프록시 경로로 변환
      if (useProxy() && presignedUrl.startsWith('http://')) {
        try {
          // presignedUrl에서 경로와 쿼리만 추출
          // 예: http://44.198.30.193:8080/photo/upload?key=1&... → /photo/upload?key=1&...
          const urlObj = new URL(presignedUrl);
          uploadUrl = urlObj.pathname + urlObj.search;
          console.log('📤 프록시 경로로 변환:', uploadUrl);
        } catch (e) {
          console.warn('URL 파싱 실패, presignedUrl 그대로 사용:', e);
          // URL 파싱 실패 시 원본 URL 사용 (에러 처리)
          throw new Error('presignedUrl 형식이 올바르지 않습니다.');
        }
      }
      
      // presignedUrl에 직접 PUT 요청
      console.log('📤 presignedUrl에 PUT 요청:', uploadUrl);
      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/png" },
        body: blob,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '응답 텍스트를 읽을 수 없음');
        throw new Error(`이미지 업로드 실패 (${res.status}): ${errorText}`);
      }
      
      console.log('✅ 이미지 업로드 성공');
    } catch (error) {
      console.error('❌ uploadToServer 에러:', error);
      throw error;
    }
  };

  const fetchQrImage = async () => {
    try {
      // 프로덕션/HTTPS 환경에서는 프록시 사용
      const url = useProxy()
        ? '/photo/download?key=1'
        : 'http://44.198.30.193:8080/photo/download?key=1';
      
      console.log('📥 QR 이미지 다운로드 요청:', url);
      
      const res = await fetch(url);
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => '응답 텍스트를 읽을 수 없음');
        console.error('❌ QR 이미지 다운로드 실패:', {
          status: res.status,
          statusText: res.statusText,
          url: url,
          errorText: errorText
        });
        throw new Error(`QR 요청 실패 (${res.status} ${res.statusText}): ${errorText}`);
      }

      const blob = await res.blob();
      console.log('✅ QR 이미지 다운로드 성공');

      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('❌ fetchQrImage 에러:', error);
      throw error;
    }
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
