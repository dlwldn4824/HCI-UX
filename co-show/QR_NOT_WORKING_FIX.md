# 🔧 QR 코드가 tellme.kwidea.com에서 안 보이는 문제 해결

## ❌ 문제 상황

- **Vercel 배포**: QR 코드가 정상적으로 보임 ✅
- **tellme.kwidea.com 배포**: QR 코드가 안 보임 ❌

## 🔍 원인

`https://tellme.kwidea.com/`가 **Vercel이 아닌 다른 서버**(kwidea.com 자체 서버)에 배포되어 있는 경우:

1. **Vercel 서버리스 함수가 작동하지 않음**
   - `/api/photo/download.js`는 Vercel에서만 작동
   - 다른 서버에서는 서버리스 함수가 실행되지 않음

2. **프록시 경로 문제**
   - `PhotoFilter.jsx`에서 `/api/photo/download?key=1`로 요청
   - 서버에 API 엔드포인트가 없으면 404 에러 발생

## ✅ 해결 방법

### 방법 1: tellme.kwidea.com 서버에 서버리스 함수 배포

만약 tellme.kwidea.com이 **Node.js 서버**라면:

#### 1-1. Express 서버에 API 엔드포인트 추가

`co-show/api/photo/download.js`를 Express 라우트로 변환:

```javascript
// server.js 또는 routes.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/api/photo/download', async (req, res) => {
  try {
    const { key } = req.query;
    const QR_SERVER_URL = process.env.QR_SERVER_URL || 'http://44.198.30.193:8080';
    const targetUrl = `${QR_SERVER_URL}/photo/download?key=${key || '1'}`;

    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'QR download failed'
      });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.byteLength);
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', message: error.message });
  }
});

module.exports = router;
```

### 방법 2: Nginx Reverse Proxy 설정 (추천)

만약 tellme.kwidea.com이 **정적 파일 서버** 또는 **Nginx**를 사용한다면:

#### 2-1. Nginx 설정 파일 수정

```nginx
server {
    listen 443 ssl;
    server_name tellme.kwidea.com;

    # 기존 설정...

    # API 프록시 설정
    location /api/photo/ {
        proxy_pass http://44.198.30.193:8080/photo/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 정적 파일 서빙
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### 방법 3: 직접 HTTP 접근 허용 (임시 해결)

**⚠️ 보안상 권장하지 않지만, 빠른 해결책:**

`PhotoFilter.jsx`에서 프로덕션 환경에서도 직접 HTTP 서버로 접근:

```javascript
const useProxy = () => {
  // 항상 false로 설정하여 직접 접근
  return false;
};
```

하지만 이 방법은 **Mixed Content 에러**가 발생할 수 있습니다.

### 방법 4: HTTPS QR 서버 구축 (최종 해결책)

가장 안전한 방법은 QR 서버도 HTTPS로 구축하는 것입니다:

1. QR 서버(`44.198.30.193:8080`)에 SSL 인증서 설치
2. `https://qr-server.kwidea.com` 같은 HTTPS 도메인 사용
3. `PhotoFilter.jsx`에서 직접 HTTPS URL로 접근

## 🔍 확인 방법

### 1. 서버 타입 확인

```bash
# HTTP 헤더 확인
curl -I https://tellme.kwidea.com/

# 서버 정보 확인
curl -I https://tellme.kwidea.com/ | grep -i server
```

### 2. API 엔드포인트 확인

```bash
# API 엔드포인트 존재 여부 확인
curl -I https://tellme.kwidea.com/api/photo/download?key=1

# 응답 확인
curl https://tellme.kwidea.com/api/photo/download?key=1
```

**예상 결과:**
- **404 Not Found**: API 엔드포인트가 없음 → 서버리스 함수 배포 필요
- **500 Error**: 서버 에러 → 서버 로그 확인 필요
- **정상 응답**: 설정은 되어 있으나 다른 문제일 수 있음

### 3. 브라우저 콘솔 확인

1. `https://tellme.kwidea.com/#/photo/filter` 접속
2. 개발자 도구 (F12) 열기
3. 콘솔 탭에서 에러 메시지 확인:

```
❌ QR 이미지 다운로드 실패: { status: 404, ... }
```

또는

```
Mixed Content: The page at 'https://...' was loaded over HTTPS, 
but requested an insecure resource 'http://44.198.30.193:8080/...'
```

## 📝 다음 단계

1. **tellme.kwidea.com 서버 타입 확인**
   - Vercel인지
   - Node.js/Express 서버인지
   - Nginx 정적 서버인지
   - 다른 서버인지

2. **서버 타입에 맞는 해결 방법 선택**
   - Vercel: 이미 설정되어 있어야 함 (문제 확인 필요)
   - Node.js: Express 라우트 추가
   - Nginx: Reverse Proxy 설정
   - 기타: 서버 관리자에게 문의

3. **테스트**
   - API 엔드포인트 확인
   - 브라우저에서 QR 코드 표시 확인

## 💡 참고

현재 `PhotoFilter.jsx`는 다음과 같이 동작합니다:

```javascript
const useProxy = () => {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isProd = import.meta.env.PROD;
  return isHttps || isProd;  // HTTPS 또는 프로덕션 환경에서는 프록시 사용
};

// 프로덕션/HTTPS 환경에서는
const url = useProxy() 
  ? '/api/photo/download?key=1'  // 프록시 사용 (Vercel 서버리스 함수)
  : 'http://44.198.30.193:8080/photo/download?key=1';  // 직접 접근
```

따라서 `https://tellme.kwidea.com/`에서는 `/api/photo/download?key=1`로 요청하게 되는데, 이 엔드포인트가 서버에 존재하지 않으면 404 에러가 발생합니다.

