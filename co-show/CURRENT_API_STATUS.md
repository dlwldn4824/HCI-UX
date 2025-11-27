# 현재 API 사용 현황

## 📊 현재 상태

### Vercel 프록시 함수 (3개)
1. ✅ `/api/photo/upload.js` - 존재함 (현재 미사용)
   - 프록시 대상: `http://44.198.30.193:8080/photo/upload`
   
2. ✅ `/api/photo/download.js` - 존재함 (현재 미사용)
   - 프록시 대상: `http://44.198.30.193:8080/photo/download`
   
3. ✅ `/api/photo/upload-put.js` - 존재함 (현재 미사용)
   - 프록시 대상: Presigned URL로 이미지 업로드

### PhotoFilter.jsx
- ❌ Vercel 프록시 사용하지 않음
- ✅ 직접 `https://tellme-api.kwidea.com` 호출 중

## 🔄 옵션 1: Vercel 프록시 사용 (기존 서버 `http://44.198.30.193:8080`)

프록시 함수들을 그대로 사용하고, PhotoFilter.jsx를 수정:

```javascript
// PhotoFilter.jsx
const API_BASE_URL = ""; // 상대 경로 사용
// 또는
const API_BASE_URL = window.location.origin; // 현재 도메인

// 1. 업로드 URL 가져오기
const getUploadUrl = async (key = "1") => {
  const res = await fetch(`/photo/upload?key=${key}`); // 프록시 경로
  // ...
};

// 2. 이미지 업로드 (presigned URL이 HTTP인 경우)
const uploadImageToServer = async (blob, uploadUrl) => {
  // HTTP presigned URL인 경우 프록시 사용
  if (uploadUrl.startsWith('http://')) {
    const encodedUrl = encodeURIComponent(uploadUrl);
    const res = await fetch(`/photo/upload-put?url=${encodedUrl}`, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': 'image/png' },
    });
    // ...
  } else {
    // HTTPS면 직접 업로드
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': 'image/png' },
    });
    // ...
  }
};

// 3. QR 코드 다운로드
const downloadQRCode = async (key = "1") => {
  const res = await fetch(`/photo/download?key=${key}`); // 프록시 경로
  // ...
};
```

**장점:**
- Mixed Content 문제 자동 해결
- Vercel 배포 시 자동으로 프록시 작동
- 기존 프록시 함수 재사용

## 🔄 옵션 2: 새로운 백엔드 직접 사용 (`https://tellme-api.kwidea.com`)

현재 상태 유지하되, 백엔드가 HTTPS이므로 프록시 불필요:

```javascript
// PhotoFilter.jsx (현재 상태)
const API_BASE_URL = "https://tellme-api.kwidea.com";

// 직접 호출
const getUploadUrl = async (key = "1") => {
  const res = await fetch(`${API_BASE_URL}/photo/upload?key=${key}`);
  // ...
};
```

**장점:**
- 간단하고 직접적
- HTTPS이므로 CORS만 설정되면 문제없음

**단점:**
- CORS 헤더가 백엔드에 설정되어 있어야 함
- 백엔드 서버가 외부에서 접근 가능해야 함

## 🔄 옵션 3: Vercel 프록시 + 새 백엔드 (`https://tellme-api.kwidea.com`)

프록시 함수들을 새 백엔드로 연결:

1. **프록시 함수 수정**: `http://44.198.30.193:8080` → `https://tellme-api.kwidea.com`
2. **PhotoFilter.jsx 수정**: 프록시 경로(`/photo/*`) 사용

**장점:**
- Vercel 프록시의 CORS 설정 활용
- 백엔드 변경 시 프록시 함수만 수정
- HTTPS → HTTPS 프록시 (보안 강화)

## 💡 추천

**`https://tellme-api.kwidea.com`가 이미 HTTPS이고 CORS가 설정되어 있다면:**
- ✅ **옵션 2 (직접 호출)** 추천
- 더 간단하고 직접적

**`https://tellme-api.kwidea.com`에 CORS 문제가 있거나, Vercel 배포 환경에서 안정성을 원한다면:**
- ✅ **옵션 3 (프록시 사용)** 추천
- Vercel 프록시를 통해 안정적인 통신

## 🔧 선택 방법

어떤 백엔드 서버를 사용하시나요?
1. `http://44.198.30.193:8080` (기존 서버)
2. `https://tellme-api.kwidea.com` (새 백엔드)
3. 둘 다 가능

선택하시면 그에 맞게 코드를 수정해드리겠습니다!

