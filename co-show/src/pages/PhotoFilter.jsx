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
  // PUT {presignedUrl} → 이미지 업로드 완료 → 공개 URL 반환
  const uploadToServer = async (presignedUrl, blob) => {
    try {
      console.log('📤 2단계: presignedUrl에 이미지 업로드 시작');
      console.log('   presignedUrl:', presignedUrl);
      
      let response;
      
      // HTTPS 환경이고 presignedUrl이 HTTP인 경우 프록시를 통해 업로드
      if (useProxy() && presignedUrl.startsWith('http://')) {
        const proxyUrl = `/photo/upload-put?url=${encodeURIComponent(presignedUrl)}`;
        console.log('📤 프록시를 통한 이미지 업로드:', proxyUrl);
        
        response = await fetch(proxyUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/png" },
          body: blob,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => '응답 텍스트를 읽을 수 없음');
          throw new Error(`이미지 업로드 실패 (${response.status}): ${errorText}`);
        }
      } else {
        // 직접 업로드 (개발 환경 또는 presignedUrl이 HTTPS인 경우)
        console.log('📤 presignedUrl에 직접 PUT 요청');
        response = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/png" },
          body: blob,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => '응답 텍스트를 읽을 수 없음');
          throw new Error(`이미지 업로드 실패 (${response.status}): ${errorText}`);
        }
      }
      
      // 업로드 후 응답에서 공개 URL 추출
      // presignedUrl에서 공개 URL로 변환 (예: http://44.198.30.193:8080/photo/upload?... → http://44.198.30.193:8080/photo/download?key=1)
      // 또는 서버 응답에서 URL을 받는 경우
      const responseText = await response.text().catch(() => '');
      console.log('📥 업로드 응답:', responseText);
      
      // presignedUrl에서 공개 다운로드 URL 생성
      // presignedUrl 형식에 따라 다를 수 있음
      // 예: presignedUrl이 S3 URL이면 그대로 사용, 아니면 서버의 공개 URL 생성
      let publicUrl = presignedUrl;
      
      // presignedUrl이 업로드 URL이면 다운로드 URL로 변환
      if (presignedUrl.includes('/photo/upload')) {
        // 업로드 URL에서 다운로드 URL로 변환
        publicUrl = presignedUrl.replace('/photo/upload', '/photo/download');
        // 쿼리 파라미터 정리 (key=1만 유지)
        const urlObj = new URL(publicUrl);
        publicUrl = `${urlObj.origin}${urlObj.pathname}?key=1`;
      }
      
      // 응답에 URL이 있으면 사용
      if (responseText && responseText.startsWith('http')) {
        publicUrl = responseText.trim();
      }
      
      console.log('✅ 이미지 업로드 성공, 공개 URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('❌ uploadToServer 에러:', error);
      throw error;
    }
  };

  // 공개 URL을 QR 코드로 생성
  const generateQRCode = async (imageUrl) => {
    try {
      console.log('🔲 QR 코드 생성 중, URL:', imageUrl);
      const qrCodeDataUrl = await QRCode.toDataURL(imageUrl, {
        width: 600,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      console.log('✅ QR 코드 생성 완료');
      return qrCodeDataUrl;
    } catch (error) {
      console.error('❌ QR 코드 생성 에러:', error);
      throw new Error('QR 코드 생성 실패');
    }
  };

  const handleCapture = async () => {
    try {
      setLoading(true); // 스피너 ON

      // 1. 사진 촬영
      console.log('📸 사진 촬영 중...');
      const imageBlob = await captureImageData();
      console.log('✅ 사진 촬영 완료');

      // 2. presignedUrl 받기
      console.log('📤 presignedUrl 요청 중...');
      const uploadUrl = await getUploadUrl();
      
      // 3. 이미지 업로드 및 공개 URL 받기
      console.log('📤 이미지 업로드 중...');
      const publicImageUrl = await uploadToServer(uploadUrl, imageBlob);
      
      // 4. 공개 URL을 QR 코드로 생성
      console.log('🔲 QR 코드 생성 중...');
      const qrCodeDataUrl = await generateQRCode(publicImageUrl);
      console.log('✅ QR 코드 생성 완료');

      // 5. QR 코드를 localStorage에 저장
      localStorage.setItem("qrUrl", qrCodeDataUrl);
      // 공개 URL도 저장 (나중에 사용할 수 있도록)
      localStorage.setItem("photoUrl", publicImageUrl);

      // 6. QR 코드 페이지로 이동
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
