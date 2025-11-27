#!/bin/bash
# Capacitor 설정 동기화 스크립트

echo "🔄 Capacitor 설정 동기화 중..."

cd "$(dirname "$0")/.."

# 1. React 빌드 (dist 폴더 생성)
echo "📦 React 빌드 중..."
npm run build

# 2. Capacitor 동기화 (설정 및 웹 에셋을 Android로 복사)
echo "🔄 Capacitor 동기화 중..."
npx cap sync android

echo "✅ 동기화 완료!"
echo ""
echo "다음 단계:"
echo "1. Android Studio에서 프로젝트 열기"
echo "2. Build → Clean Project"
echo "3. Build → Rebuild Project"
echo "4. Build → Build Bundle(s) / APK(s) → Build APK(s)"

