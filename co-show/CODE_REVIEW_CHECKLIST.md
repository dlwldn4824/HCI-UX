# 📋 PhotoFilter.jsx 코드 리뷰 체크리스트

배포 전 코드가 올바르게 작동하는지 확인하는 체크리스트입니다.

## ✅ API 엔드포인트 확인

### 1. 업로드 URL 요청
```javascript
const getUploadUrl = async (key = "1") => {
  const res = await fetch(`${API_BASE_URL}/photo/upload?key=${key}`);
  // ...
};
```

**확인 사항:**
- [ ] API_BASE_URL이 올바른지: `https://tellme-api.kwidea.com`
- [ ] 엔드포인트 경로가 올바른지: `/photo/upload`
- [ ] 쿼리 파라미터 형식: `?key=1`
- [ ] 응답 형식: 텍스트 (presigned URL)
- [ ] 에러 처리: res.ok 체크 및 에러 메시지

### 2. 이미지 업로드
```javascript
const uploadImageToServer = async (blob, uploadUrl) => {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: blob,
    headers: { "Content-Type": "image/png" },
  });
  // ...
};
```

**확인 사항:**
- [ ] HTTP 메서드: `PUT` (presigned URL은 보통 PUT 사용)
- [ ] Content-Type 헤더: `image/png`
- [ ] Body 형식: Blob 객체
- [ ] 에러 처리: res.ok 체크

### 3. QR 코드 다운로드
```javascript
const downloadQRCode = async (key = "1") => {
  const res = await fetch(`${API_BASE_URL}/photo/download?key=${key}`);
  // ...
};
```

**확인 사항:**
- [ ] 엔드포인트 경로: `/photo/download`
- [ ] 쿼리 파라미터: `?key=1`
- [ ] 응답 형식: 이미지 (Blob)
- [ ] Base64 변환: FileReader 사용
- [ ] 에러 처리

## 🔄 플로우 검증

### 전체 플로우
1. **이미지 캡처** → `captureImageData()`
   - [ ] Canvas에서 비디오 캡처
   - [ ] 필터 오버레이 적용
   - [ ] Blob으로 변환

2. **업로드 URL 가져오기** → `getUploadUrl("1")`
   - [ ] API 호출 성공
   - [ ] 올바른 presigned URL 받기

3. **이미지 업로드** → `uploadImageToServer(blob, uploadUrl)`
   - [ ] PUT 요청 성공
   - [ ] 서버에서 이미지 저장 확인

4. **QR 코드 다운로드** → `downloadQRCode("1")`
   - [ ] 이미지 다운로드 성공
   - [ ] Base64 변환 성공

5. **localStorage 저장 및 이동**
   - [ ] QR 코드 Base64 저장
   - [ ] `/photo/qr`로 네비게이션

## ⚠️ 잠재적 문제점 및 해결책

### 1. CORS 문제
**문제:** 브라우저에서 다른 도메인으로 요청 시 CORS 에러 발생

**확인 방법:**
```javascript
// 브라우저 콘솔에서
fetch('https://tellme-api.kwidea.com/photo/upload?key=1')
  .then(res => console.log('CORS OK:', res))
  .catch(err => console.error('CORS Error:', err));
```

**해결책:**
- 백엔드 서버에서 `Access-Control-Allow-Origin` 헤더 설정
- 프록시 서버 사용 (이미 Vercel 프록시가 있었지만, 새로운 API는 직접 호출)

### 2. 업로드 후 QR 코드가 아직 생성되지 않음
**문제:** 업로드 후 즉시 QR 코드를 요청하면 아직 생성되지 않았을 수 있음

**해결책:**
- 재시도 로직 추가
- 또는 업로드 응답에서 QR 코드를 직접 받기

### 3. Key 매칭 문제
**문제:** `key=1`로 업로드했는데 다른 key로 QR 코드를 받으면 안 됨

**확인:**
- 백엔드에서 key 기반으로 이미지를 매칭하는지 확인
- 동일한 key를 사용해야 함

### 4. Presigned URL 만료
**문제:** Presigned URL이 짧은 시간 후 만료될 수 있음

**해결책:**
- 업로드 URL을 받은 직후 즉시 업로드
- 만료 시간이 충분한지 확인 (보통 5-15분)

## 🧪 테스트 시나리오

### 성공 케이스
1. ✅ 정상적인 이미지 업로드 및 QR 코드 생성
2. ✅ 필터 적용된 이미지 업로드
3. ✅ 다양한 이미지 크기 업로드

### 에러 케이스
1. ❌ 네트워크 오류
   - 확인: try-catch에서 에러 처리
   - 사용자 피드백: alert 표시

2. ❌ 서버 에러 (500)
   - 확인: res.ok 체크
   - 사용자 피드백: 에러 메시지

3. ❌ 업로드 URL 가져오기 실패
   - 확인: getUploadUrl에서 에러 처리

4. ❌ 이미지 업로드 실패
   - 확인: uploadImageToServer에서 에러 처리

5. ❌ QR 코드 다운로드 실패
   - 확인: downloadQRCode에서 에러 처리

## 📊 로깅 확인

코드에 다음 로그가 포함되어 있는지 확인:
- [x] `console.log("📤 업로드 URL:", uploadUrl)`
- [x] `console.log("✅ 이미지 업로드 완료")`
- [x] `console.log("✅ QR 코드 다운로드 완료")`
- [x] `console.error("❌ 에러:", err)`

## 🔍 코드 검증 명령어

### 1. 문법 검사
```bash
cd co-show
npm run lint src/pages/PhotoFilter.jsx
```

### 2. 타입 검사 (TypeScript가 있다면)
```bash
npm run type-check
```

### 3. 빌드 테스트
```bash
npm run build
```

## 📝 개선 제안

### 1. 재시도 로직 추가
```javascript
const downloadQRCodeWithRetry = async (key = "1", maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await downloadQRCode(key);
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### 2. 진행 상황 표시
```javascript
const [uploadProgress, setUploadProgress] = useState(0);
// XMLHttpRequest 사용하여 진행률 표시
```

### 3. 키 동기화
```javascript
// 업로드와 다운로드에 동일한 key 사용
const photoKey = "1";
const uploadUrl = await getUploadUrl(photoKey);
await uploadImageToServer(imageBlob, uploadUrl);
const qrBase64 = await downloadQRCode(photoKey);
```

## ✅ 최종 확인

배포 전 최종 확인:
- [ ] 모든 API 엔드포인트가 올바르게 설정됨
- [ ] 에러 처리가 모든 단계에 포함됨
- [ ] 사용자 피드백(로딩, 에러 메시지)이 적절함
- [ ] localStorage에 QR 코드가 올바른 형식으로 저장됨
- [ ] 네비게이션이 올바른 경로로 이동함

