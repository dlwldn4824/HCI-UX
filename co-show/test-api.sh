#!/bin/bash

# 백엔드 API 테스트 스크립트
# 사용법: ./test-api.sh

API_BASE="https://tellme-api.kwidea.com"

echo "🔍 백엔드 API 테스트 시작..."
echo "========================================="
echo ""

# 1. 서버 상태 확인
echo "1️⃣ 서버 상태 확인..."
STATUS=$(curl -s "$API_BASE/")
if [ $? -eq 0 ]; then
  echo "✅ 서버 응답: $STATUS"
else
  echo "❌ 서버 연결 실패"
  exit 1
fi
echo ""

# 2. 업로드 URL 요청
echo "2️⃣ 업로드 URL 요청..."
UPLOAD_URL=$(curl -s "$API_BASE/photo/upload?key=1")
if [ -z "$UPLOAD_URL" ]; then
  echo "❌ 업로드 URL 가져오기 실패 (빈 응답)"
  exit 1
fi

# URL이 HTTP/HTTPS로 시작하는지 확인
if [[ ! "$UPLOAD_URL" =~ ^https?:// ]]; then
  echo "⚠️ 업로드 URL 형식 이상: $UPLOAD_URL"
else
  echo "✅ 업로드 URL 획득 성공"
  echo "   URL (처음 80자): ${UPLOAD_URL:0:80}..."
fi
echo ""

# 3. QR 코드 다운로드 시도
echo "3️⃣ QR 코드 다운로드 테스트..."
HTTP_CODE=$(curl -s -o qr-test.png -w "%{http_code}" "$API_BASE/photo/download?key=1")
if [ "$HTTP_CODE" -eq 200 ]; then
  FILE_SIZE=$(wc -c < qr-test.png 2>/dev/null || echo 0)
  if [ "$FILE_SIZE" -gt 100 ]; then
    echo "✅ QR 코드 다운로드 성공"
    echo "   HTTP 상태: $HTTP_CODE"
    echo "   파일 크기: $FILE_SIZE bytes"
    echo "   파일 저장: qr-test.png"
  else
    echo "⚠️ QR 코드 파일이 너무 작습니다 ($FILE_SIZE bytes)"
  fi
else
  echo "❌ QR 코드 다운로드 실패"
  echo "   HTTP 상태: $HTTP_CODE"
  if [ -f qr-test.png ]; then
    echo "   응답 내용: $(head -n 1 qr-test.png)"
  fi
fi
echo ""

# 4. CORS 헤더 확인
echo "4️⃣ CORS 헤더 확인..."
CORS_HEADER=$(curl -s -I "$API_BASE/photo/upload?key=1" | grep -i "access-control-allow-origin" || echo "없음")
echo "   CORS 헤더: $CORS_HEADER"
echo ""

echo "========================================="
echo "✅ 테스트 완료"
echo ""
echo "💡 다음 단계:"
echo "   1. qr-test.png 파일을 확인하여 유효한 QR 코드인지 확인"
echo "   2. 브라우저에서 직접 API를 호출하여 CORS 문제 확인"
echo "   3. PhotoFilter.jsx의 실제 플로우와 비교"

