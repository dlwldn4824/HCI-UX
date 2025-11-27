# 🔄 Vercel 프록시 설정 가이드

## 📋 문제 상황

- **프론트엔드**: HTTPS (`https://tellme.kwidea.com`)
- **QR 서버**: HTTP (`http://44.198.30.193:8080`)
- **문제**: Mixed Content 정책으로 HTTPS → HTTP 직접 호출 차단

## ✅ 해결 방법: Vercel 서버리스 함수 프록시

Vercel 서버리스 함수를 통해 HTTPS → HTTPS (같은 도메인)로 보이게 하고, 내부적으로 HTTP 서버로 프록시합니다.

## 📁 생성된 서버리스 함수

### 1. `/api/photo/upload.js`
- **경로**: `GET /api/photo/upload?key=1`
- **기능**: 업로드 URL 요청을 HTTP 서버로 프록시
- **반환**: 업로드 URL (문자열)

### 2. `/api/photo/download.js`
- **경로**: `GET /api/photo/download?key=1`
- **기능**: QR 이미지 다운로드를 HTTP 서버로 프록시
- **반환**: QR 이미지 (바이너리)

### 3. `/api/photo/upload-put.js`
- **경로**: `PUT /api/photo/upload-put?url=<인코딩된_URL>`
- **기능**: 이미지 업로드 PUT 요청을 HTTP 서버로 프록시
- **요청 본문**: 이미지 바이너리 데이터

## 🔄 작동 흐름

### 개발 환경 (HTTP)
```
브라우저 → http://localhost:5173
  ↓
직접 HTTP 서버 접근
  ↓
http://44.198.30.193:8080/photo/upload
```

### 프로덕션 환경 (HTTPS)
```
브라우저 → https://tellme.kwidea.com
  ↓
HTTPS로 같은 도메인 API 호출
  ↓
GET /api/photo/upload?key=1
  ↓
Vercel 서버리스 함수 (Node.js 서버)
  ↓
서버 → 서버 HTTP 통신 (브라우저 관여 없음)
  ↓
http://44.198.30.193:8080/photo/upload
```

## 💻 코드 구조

### 프론트엔드 (`PhotoFilter.jsx`)

```javascript
// 프로덕션/HTTPS 환경 감지
const useProxy = () => {
  const isHttps = window.location.protocol === 'https:';
  const isProd = import.meta.env.PROD;
  return isHttps || isProd;
};

// 1. 업로드 URL 가져오기
const getUploadUrl = async () => {
  const url = useProxy() 
    ? '/api/photo/upload?key=1'  // 프록시 사용
    : 'http://44.198.30.193:8080/photo/upload?key=1';  // 직접 접근
  
  const res = await fetch(url);
  return await res.text();  // 업로드 URL 반환
};

// 2. 이미지 업로드
const uploadToServer = async (uploadUrl, blob) => {
  if (useProxy() && uploadUrl.startsWith('http://')) {
    // HTTP URL이면 프록시 사용
    const proxyUrl = `/api/photo/upload-put?url=${encodeURIComponent(uploadUrl)}`;
    await fetch(proxyUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/png' },
      body: blob,
    });
  } else {
    // HTTPS URL이면 직접 업로드
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/png' },
      body: blob,
    });
  }
};

// 3. QR 이미지 다운로드
const fetchQrImage = async () => {
  const url = useProxy()
    ? '/api/photo/download?key=1'  // 프록시 사용
    : 'http://44.198.30.193:8080/photo/download?key=1';  // 직접 접근
  
  const res = await fetch(url);
  const blob = await res.blob();
  // ... Base64로 변환
};
```

## 🚀 배포 방법

1. **코드 푸시**
   ```bash
   git add api/photo/*.js
   git commit -m "Add Vercel proxy functions for QR server"
   git push
   ```

2. **Vercel 자동 배포**
   - Vercel이 `api/` 폴더를 자동으로 인식하여 서버리스 함수로 배포

3. **(선택) 환경 변수 설정**
   - Vercel 대시보드 → Settings → Environment Variables
   - `QR_SERVER_URL`: `http://44.198.30.193:8080` (기본값이 이미 설정되어 있어 선택사항)

## ✅ 테스트 방법

### 1. 로컬 테스트 (개발 환경)
```bash
cd co-show
npm run dev
```
- 브라우저: `http://localhost:5173`
- HTTP 서버에 직접 접근 (프록시 사용 안 함)

### 2. 프로덕션 테스트
```bash
# Vercel에 배포 후
https://tellme.kwidea.com
```
- 프록시를 통해 HTTP 서버 접근
- 브라우저 콘솔에서 로그 확인:
  - `📤 업로드 URL 요청: /api/photo/upload?key=1`
  - `✅ 업로드 URL 획득: http://...`
  - `✅ 이미지 업로드 성공`
  - `✅ QR 이미지 다운로드 성공`

## 🔍 디버깅

### Vercel 로그 확인
1. Vercel 대시보드 → 프로젝트 → Functions 탭
2. 각 서버리스 함수 클릭 → Logs 확인
3. 콘솔 로그 확인:
   - `[프록시] 업로드 URL 요청: http://...`
   - `[프록시] 성공: 업로드 URL 획득`

### 브라우저 콘솔 확인
- Network 탭에서 `/api/photo/*` 요청 확인
- Status 200 확인
- Response 확인

## ⚠️ 주의사항

1. **서버리스 함수 타임아웃**
   - 기본 타임아웃: 10초 (Hobby 플랜)
   - 큰 이미지 업로드 시 타임아웃 가능성 있음
   - 필요시 Vercel Pro 플랜으로 업그레이드 (60초 타임아웃)

2. **환경 변수**
   - `QR_SERVER_URL`은 서버리스 함수에서만 사용
   - 클라이언트 코드에는 노출되지 않음

3. **CORS**
   - 서버리스 함수에서 CORS 헤더 설정 필요
   - 현재는 `Access-Control-Allow-Origin: *`로 설정

## 📝 요약

✅ **HTTPS 환경에서 Mixed Content 문제 해결**
- 브라우저: HTTPS → HTTPS (같은 도메인)
- 실제 통신: Vercel 서버 → HTTP 서버 (브라우저 관여 없음)

✅ **개발 환경 유연성**
- 로컬에서는 직접 HTTP 접근
- 프로덕션에서는 자동으로 프록시 사용

✅ **투명한 프록시**
- 클라이언트 코드에서 프록시 여부 자동 감지
- 개발/프로덕션 환경 모두에서 동일한 API 사용

