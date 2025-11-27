#!/bin/bash
# 완전한 재빌드 및 재설치 스크립트

echo "🔄 완전한 재빌드 및 재설치 시작..."
echo ""

cd "$(dirname "$0")/.."

# 1. React 빌드
echo "📦 1/5 React 빌드 중..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ React 빌드 실패"
    exit 1
fi

# 2. Capacitor 동기화
echo "🔄 2/5 Capacitor 설정 동기화 중..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "❌ Capacitor 동기화 실패"
    exit 1
fi

# 3. Android 빌드 캐시 정리
echo "🧹 3/5 Android 빌드 캐시 정리 중..."
cd android
./gradlew clean
rm -rf app/build/
rm -rf build/

# 4. APK 빌드
echo "🔨 4/5 APK 빌드 중..."
./gradlew assembleDebug
if [ $? -ne 0 ]; then
    echo "❌ APK 빌드 실패"
    exit 1
fi

# 5. 앱 완전 삭제 및 재설치
echo "📱 5/5 앱 삭제 및 재설치 중..."
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK 파일을 찾을 수 없습니다: $APK_PATH"
    exit 1
fi

# 디바이스 확인
if ! adb devices | grep -q "device$"; then
    echo "❌ 연결된 디바이스가 없습니다. 'adb devices'로 확인하세요."
    exit 1
fi

# 앱 완전 삭제
echo "   - 앱 데이터 삭제 중..."
adb shell pm clear com.example.coshowsample 2>/dev/null
echo "   - 앱 삭제 중..."
adb uninstall com.example.coshowsample 2>/dev/null

# 새 APK 설치
echo "   - 새 APK 설치 중..."
adb install -r -d "$APK_PATH"
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 완료! 앱이 재설치되었습니다."
    echo ""
    echo "📋 다음 단계:"
    echo "   1. 앱 실행"
    echo "   2. 로그 확인: adb logcat | grep MainActivity"
    echo "   3. 'Loading URL: https://tellme.kwidea.com/' 메시지 확인"
else
    echo "❌ APK 설치 실패"
    exit 1
fi

