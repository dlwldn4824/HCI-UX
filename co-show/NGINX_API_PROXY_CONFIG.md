# 🔧 Nginx Reverse Proxy 설정 가이드

`https://tellme.kwidea.com/`가 OpenResty(Nginx) 서버이므로, API 프록시를 추가해야 합니다.

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

    # API 프록시 설정 - 추가 필요!
    location /api/photo/ {
        proxy_pass http://44.198.30.193:8080/photo/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        
        # CORS 헤더 추가 (필요한 경우)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        
        # OPTIONS 요청 처리
        if ($request_method = OPTIONS) {
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
curl -I https://tellme.kwidea.com/api/photo/download?key=1

# 이미지 데이터 확인 (Content-Type이 image/png인지 확인)
curl -I https://tellme.kwidea.com/api/photo/download?key=1 | grep -i content-type
```

**예상 결과:**
```
Content-Type: image/png
```

HTML이 아닌 이미지 데이터가 반환되어야 합니다.

