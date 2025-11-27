# 🔍 백엔드 API 테스트 가이드

배포 전 백엔드 API가 정상 작동하는지 확인하는 방법입니다.

## 📋 테스트 순서

### 1. 백엔드 서버 상태 확인

```bash
curl https://tellme-api.kwidea.com/
```

**예상 응답:**
- `Backend OK` 또는 서버 상태 메시지

### 2. 업로드 URL 요청 테스트

```bash
curl https://tellme-api.kwidea.com/photo/upload?key=1
```

**예상 응답:**
- presigned URL (예: `https://...s3.amazonaws.com/...` 또는 다른 업로드 URL)
- 또는 에러 메시지

**성공 시:**
```
https://some-storage-url.com/photo/upload/path?signature=...
```

### 3. QR 코드 다운로드 테스트 (업로드 후)

```bash
curl -o qr-code-test.png https://tellme-api.kwidea.com/photo/download?key=1
```

**예상 응답:**
- PNG 또는 이미지 파일 다운로드
- 파일 확인: `file qr-code-test.png` 또는 이미지 뷰어로 열기

### 4. 이미지 업로드 전체 플로우 테스트

```bash
# 1. 업로드 URL 가져오기
UPLOAD_URL=$(curl -s https://tellme-api.kwidea.com/photo/upload?key=1)
echo "업로드 URL: $UPLOAD_URL"

# 2. 테스트 이미지 업로드 (필요한 경우)
# 작은 테스트 이미지 생성 (1x1 픽셀 PNG)
echo -e '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc\xf8\x00\x00\x00\x01\x00\x01\x00\x00\x00\x00IEND\xaeB`\x82' > test-image.png

# 3. 이미지 업로드
curl -X PUT "$UPLOAD_URL" \
  -H "Content-Type: image/png" \
  --data-binary @test-image.png

# 4. QR 코드 다운로드
curl -o qr-result.png https://tellme-api.kwidea.com/photo/download?key=1
```

## 🔧 자동화 스크립트

`test-api.sh` 파일을 생성하여 한 번에 테스트:

```bash
#!/bin/bash

API_BASE="https://tellme-api.kwidea.com"

echo "🔍 백엔드 API 테스트 시작..."
echo ""

# 1. 서버 상태 확인
echo "1️⃣ 서버 상태 확인..."
STATUS=$(curl -s "$API_BASE/")
echo "응답: $STATUS"
echo ""

# 2. 업로드 URL 요청
echo "2️⃣ 업로드 URL 요청..."
UPLOAD_URL=$(curl -s "$API_BASE/photo/upload?key=1")
if [ -z "$UPLOAD_URL" ]; then
  echo "❌ 업로드 URL 가져오기 실패"
  exit 1
fi
echo "✅ 업로드 URL 획득: ${UPLOAD_URL:0:50}..."
echo ""

# 3. QR 코드 다운로드 시도
echo "3️⃣ QR 코드 다운로드..."
QR_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_BASE/photo/download?key=1" -o qr-test.png)
HTTP_CODE=$(echo "$QR_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ QR 코드 다운로드 성공 (HTTP $HTTP_CODE)"
  echo "파일 크기: $(wc -c < qr-test.png) bytes"
else
  echo "⚠️ QR 코드 다운로드 응답 코드: $HTTP_CODE"
fi
echo ""

echo "✅ 테스트 완료"
```

## 🌐 브라우저 콘솔에서 테스트

개발자 도구(F12) → Console에서 실행:

```javascript
// 1. 업로드 URL 요청
fetch('https://tellme-api.kwidea.com/photo/upload?key=1')
  .then(res => res.text())
  .then(url => {
    console.log('✅ 업로드 URL:', url);
    return url;
  })
  .catch(err => console.error('❌ 에러:', err));

// 2. QR 코드 다운로드
fetch('https://tellme-api.kwidea.com/photo/download?key=1')
  .then(res => {
    if (res.ok) {
      return res.blob();
    }
    throw new Error(`HTTP ${res.status}`);
  })
  .then(blob => {
    console.log('✅ QR 코드 다운로드 성공:', blob.size, 'bytes');
    const url = URL.createObjectURL(blob);
    console.log('이미지 URL:', url);
    // 이미지 확인하려면:
    // const img = document.createElement('img');
    // img.src = url;
    // document.body.appendChild(img);
  })
  .catch(err => console.error('❌ 에러:', err));
```

## 📝 PhotoFilter.jsx 코드 검증 체크리스트

- [x] API_BASE_URL이 올바른지 확인: `https://tellme-api.kwidea.com`
- [x] 업로드 URL 요청: `GET /photo/upload?key=1`
- [x] 이미지 업로드: `PUT` 메서드로 presigned URL에 업로드
- [x] QR 코드 다운로드: `GET /photo/download?key=1`
- [x] 에러 처리: 각 단계에서 try-catch 및 사용자 피드백
- [x] 로딩 상태: 스피너 표시
- [x] Base64 변환: QR 코드를 Base64로 변환하여 localStorage에 저장

## ⚠️ 주의사항

1. **CORS 문제**: 브라우저에서 직접 호출 시 CORS 에러가 발생할 수 있습니다. 
   - 백엔드 서버에서 CORS 헤더를 설정해야 합니다.
   - 확인: `curl -I https://tellme-api.kwidea.com/photo/upload?key=1`

2. **인증/키 문제**: `key=1` 파라미터가 올바른지 확인
   - 백엔드에서 key 기반으로 이미지를 매칭하는지 확인

3. **업로드 후 QR 코드 생성 시간**: 
   - 업로드 후 즉시 QR 코드를 다운로드할 수 있는지 확인
   - 비동기 처리로 시간이 걸릴 수 있음

## 🐛 디버깅

문제 발생 시 확인사항:

1. **네트워크 탭 확인** (브라우저 DevTools)
   - 요청 URL이 올바른지
   - HTTP 상태 코드 확인
   - 응답 내용 확인

2. **콘솔 로그 확인**
   - PhotoFilter.jsx에서 `console.log` 추가
   - 각 단계별 응답 확인

3. **백엔드 로그 확인**
   - 서버 로그에서 에러 메시지 확인

