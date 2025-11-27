# ✅ 프록시 설정 수정 완료

Mixed Content 문제를 해결하기 위한 프록시 설정을 수정했습니다.

## 🔧 수정된 내용

### 1. PhotoFilter.jsx - useProxy() 함수 수정

**이전 (문제):**
```javascript
const useProxy = () => {
  if (hostname === 'tellme.kwidea.com' || hostname.includes('kwidea.com')) {
    return false; // ❌ 직접 HTTP 접근 → Mixed Content 에러
  }
  // ...
};
```

**수정 후:**
```javascript
const useProxy = () => {
  if (typeof window === 'undefined') return false;
  // HTTPS 페이지에서는 무조건 프록시 사용
  return window.location.protocol === 'https:';
};
```

### 2. 동작 방식

| 환경 | URL | 프록시 사용 | 접근 방식 |
|------|-----|------------|----------|
| 개발 | `http://localhost:5173` | ❌ | 직접 `http://44.198.30.193:8080` 접근 |
| 배포 | `https://tellme.kwidea.com` | ✅ | `/api/photo/*` 프록시 경로 사용 |

## 🚀 작동 흐름

### 배포 환경 (HTTPS)

```
브라우저: https://tellme.kwidea.com/#/photo/filter
  ↓
fetch('/api/photo/upload?key=1')  // HTTPS 요청
  ↓
Nginx/Vercel 프록시
  ↓
http://44.198.30.193:8080/photo/upload?key=1  // 서버 간 통신
  ↓
응답 반환 (HTTPS로 브라우저에 전달)
```

**✅ 브라우저 입장: HTTPS → HTTPS (Mixed Content 없음)**

## 📋 필요한 서버 설정

### Vercel 사용 시

`vercel.config` 파일이 이미 설정되어 있습니다:
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "http://44.198.30.193:8080/$1"
    }
  ]
}
```

**Vercel Serverless Functions도 있음:**
- `/api/photo/upload.js`
- `/api/photo/download.js`
- `/api/photo/upload-put.js`

이 함수들이 우선적으로 실행되므로 `vercel.config`의 rewrites는 백업 역할을 합니다.

### Nginx 사용 시 (tellme.kwidea.com)

`NGINX_PROXY_CONFIG.md` 파일을 참고하여 Nginx 설정을 추가하세요:

```nginx
location /api/photo/ {
    proxy_pass http://44.198.30.193:8080/photo/;
    # ... 기타 설정
}
```

## ✅ 확인 방법

### 1. 브라우저 콘솔 확인

배포 후 브라우저 콘솔에서 확인:

```
📤 업로드 URL 요청: /api/photo/upload?key=1  // ✅ 정상
✅ 업로드 URL 획득: http://...
```

**에러가 없어야 함:**
- ❌ `Mixed Content: ...` → 해결됨
- ❌ `Failed to fetch` → 해결됨
- ❌ `404 Not Found` → Nginx 프록시 설정 필요

### 2. Network 탭 확인

브라우저 개발자 도구 → Network 탭:
- `/api/photo/upload?key=1` 요청이 **200 OK**로 성공해야 함
- Status가 `200`이고 응답이 정상적으로 오는지 확인

### 3. 서버 로그 확인

Nginx 서버 로그에서 프록시 요청 확인:
```bash
tail -f /var/log/nginx/access.log | grep /api/photo
```

## 🎯 예상 결과

### 수정 전
```
❌ Mixed Content: The page at 'https://tellme.kwidea.com' 
   was loaded over HTTPS, but requested an insecure resource 
   'http://44.198.30.193:8080/...'
❌ TypeError: Failed to fetch
```

### 수정 후
```
✅ https://tellme.kwidea.com/api/photo/upload?key=1 → 200 OK
✅ https://tellme.kwidea.com/api/photo/download?key=1 → 200 OK (image/png)
✅ Mixed Content 에러 없음
```

## 📝 다음 단계

1. **코드 수정 완료** ✅
   - `useProxy()` 함수 수정 완료

2. **빌드 및 배포**
   ```bash
   cd co-show
   npm run build
   # dist 폴더를 tellme.kwidea.com 서버에 배포
   ```

3. **서버 설정 확인**
   - Vercel 사용: 자동으로 작동
   - Nginx 사용: `NGINX_PROXY_CONFIG.md` 참고하여 설정 추가

4. **테스트**
   - 브라우저에서 사진 촬영 기능 테스트
   - 콘솔 에러 확인
   - QR 코드 정상 표시 확인

## 🔗 관련 파일

- `co-show/src/pages/PhotoFilter.jsx` - 수정 완료
- `co-show/vercel.config` - 이미 설정됨
- `co-show/api/photo/*.js` - Vercel Serverless Functions
- `NGINX_PROXY_CONFIG.md` - Nginx 설정 가이드

