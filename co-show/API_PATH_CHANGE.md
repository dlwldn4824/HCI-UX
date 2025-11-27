# 🔧 API 경로 변경: `/api/photo/*` → `/photo/*`

API 경로를 `/api/photo/*`에서 `/photo/*`로 변경했습니다.

## ✅ 변경 사항

### 1. 프론트엔드 코드
- `PhotoFilter.jsx`의 모든 API 호출 경로를 `/photo/*`로 통일

**변경된 경로:**
- `/api/photo/upload` → `/photo/upload`
- `/api/photo/download` → `/photo/download`
- `/api/photo/upload-put` → `/photo/upload-put`

## ⚠️ 중요: 서버 프록시 설정 변경 필요

프론트엔드 코드는 변경했지만, **서버 프록시 설정도 함께 변경**해야 합니다.

### 방법 1: Nginx 설정 변경 (tellme.kwidea.com)

`NGINX_PROXY_CONFIG.md` 파일을 참고하되, 경로를 다음과 같이 변경:

**이전:**
```nginx
location /api/photo/ {
    proxy_pass http://44.198.30.193:8080/photo/;
}
```

**변경 후:**
```nginx
location /photo/ {
    proxy_pass http://44.198.30.193:8080/photo/;
    proxy_http_version 1.1;
    
    # 기본 프록시 헤더
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Connection "";
    
    # 타임아웃 설정
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # 버퍼링 설정 (대용량 파일 업로드용)
    proxy_request_buffering off;
    proxy_buffering off;
    
    # CORS 헤더
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type" always;
    
    # OPTIONS 요청 처리
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }
}
```

### 방법 2: Vercel 설정 변경

**주의:** Vercel Serverless Functions는 `/api/*` 경로에 있어야 합니다!

만약 `/photo/*` 경로를 사용하려면:

1. **Option A: Vercel rewrites 사용 (권장)**
   
   `vercel.config` 파일 수정:
   ```json
   {
     "version": 2,
     "rewrites": [
       {
         "source": "/photo/(.*)",
         "destination": "http://44.198.30.193:8080/photo/$1"
       }
     ]
   }
   ```

2. **Option B: Serverless Functions 경로 변경 (비권장)**
   
   `/api/photo/*.js` 파일들을 `/photo/*.js`로 이동하면 작동하지만, Vercel의 권장 구조가 아님

### 방법 3: Serverless Functions 유지 + Rewrites 추가 (최선)

현재 구조를 유지하면서 rewrites 추가:

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/photo/(.*)",
      "destination": "/api/photo/$1"
    },
    {
      "source": "/api/(.*)",
      "destination": "http://44.198.30.193:8080/$1"
    }
  ]
}
```

이렇게 하면:
- `/photo/*` → `/api/photo/*`로 리다이렉트
- `/api/photo/*` → Serverless Functions 또는 HTTP 서버로 프록시

## 🎯 권장 설정

### Nginx 사용 시 (tellme.kwidea.com)

```nginx
location /photo/ {
    proxy_pass http://44.198.30.193:8080/photo/;
    # ... 기타 프록시 설정
}
```

### Vercel 사용 시

현재 Serverless Functions 구조 유지 + rewrites 추가:

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/photo/upload",
      "destination": "/api/photo/upload"
    },
    {
      "source": "/photo/download",
      "destination": "/api/photo/download"
    },
    {
      "source": "/photo/upload-put",
      "destination": "/api/photo/upload-put"
    }
  ]
}
```

## ✅ 확인 방법

설정 변경 후:

```bash
# 업로드 URL 요청
curl https://tellme.kwidea.com/photo/upload?key=1

# QR 다운로드
curl -I https://tellme.kwidea.com/photo/download?key=1
```

**예상 결과:**
- Status: `200 OK`
- Content-Type: 적절한 타입 (text/plain 또는 image/png)

## 📝 정리

| 항목 | 이전 | 변경 후 |
|------|------|---------|
| 프론트엔드 경로 | `/api/photo/*` | `/photo/*` ✅ |
| 서버 프록시 | `/api/photo/*` → `...` | `/photo/*` → `...` ⚠️ 변경 필요 |

**⚠️ 주의:** 서버 프록시 설정을 변경하지 않으면 404 에러가 발생합니다!

