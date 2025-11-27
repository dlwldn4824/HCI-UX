# 🔧 Nginx Reverse Proxy 설정 가이드

`tellme.kwidea.com`이 OpenResty(Nginx) 서버이므로, API 프록시를 추가해야 합니다.

## ✅ Nginx 설정 추가

서버의 Nginx 설정 파일에 다음을 추가하세요:

```nginx
server {
    listen 443 ssl http2;
    server_name tellme.kwidea.com;

    # SSL 설정 (기존 설정 유지)
    # ssl_certificate ...
    # ssl_certificate_key ...

    # 정적 파일 서빙 (기존 설정)
    root /path/to/dist;
    index index.html;

    # ========================================
    # API 프록시 설정 - 추가 필요!
    # ========================================
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
        
        # CORS 헤더 추가 (필요한 경우)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        
        # OPTIONS 요청 처리 (CORS preflight)
        if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Content-Type" always;
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
    }

    # SPA 라우팅을 위한 설정
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔄 설정 적용

설정 파일 수정 후:

```bash
# 설정 파일 검증
sudo nginx -t

# Nginx 재시작
sudo systemctl reload nginx
# 또는
sudo service nginx reload
```

## ✅ 확인

설정이 올바르게 적용되었는지 확인:

```bash
# API 엔드포인트 확인
curl -I https://tellme.kwidea.com/photo/download?key=1

# 이미지 데이터 확인 (Content-Type이 image/png인지 확인)
curl -I https://tellme.kwidea.com/photo/download?key=1 | grep -i content-type

# 업로드 URL 확인
curl https://tellme.kwidea.com/photo/upload?key=1
```

**예상 결과:**
- `/photo/download`: `Content-Type: image/png`
- `/photo/upload`: 업로드 URL 문자열 반환

## 🔍 문제 해결

### 502 Bad Gateway
- 백엔드 서버(`44.198.30.193:8080`)가 접근 가능한지 확인
- 방화벽 규칙 확인

### 404 Not Found
- `location /api/photo/` 경로가 올바른지 확인
- `proxy_pass` URL 끝에 `/`가 있는지 확인

### 타임아웃
- `proxy_connect_timeout`, `proxy_send_timeout`, `proxy_read_timeout` 값 증가

### CORS 에러
- 브라우저에서 직접 호출하는 경우 `Access-Control-Allow-Origin` 헤더 확인

