#!/bin/bash
# 안드로이드 빌드 캐시 정리 및 재빌드 스크립트

echo "🧹 안드로이드 빌드 캐시 정리 중..."

cd "$(dirname "$0")"

# 1. Gradle 캐시 정리
echo "📦 Gradle 빌드 캐시 정리..."
./gradlew clean

# 2. 빌드 디렉토리 삭제
echo "🗑️  빌드 디렉토리 삭제..."
rm -rf app/build/
rm -rf build/
rm -rf .gradle/

# 3. 캐시된 의존성 정리 (선택사항, 필요시 주석 해제)
# echo "🗑️  Gradle 의존성 캐시 정리..."
# rm -rf ~/.gradle/caches/

echo "✅ 정리 완료!"
echo ""
echo "다음 단계:"
echo "1. ./gradlew assembleDebug 또는 ./gradlew assembleRelease로 재빌드"
echo "2. 또는 Android Studio에서 Clean Project 후 Rebuild"

