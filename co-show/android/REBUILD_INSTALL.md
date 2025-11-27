# 🔄 Android APK 재빌드 및 재설치 가이드

## 문제: 새로 빌드해도 이전 버전이 설치됨

### 원인
- `versionCode`가 항상 `1`로 고정되어 있어서 Android 시스템이 같은 버전으로 인식
- 빌드 캐시 문제

### 해결 방법

## 1️⃣ 버전 코드 자동 증가 (이미 설정됨)

`build.gradle`에서 버전 코드가 **날짜/시간 기반으로 자동 증가**하도록 설정되어 있습니다.

```gradle
versionCode Integer.parseInt(buildTime.substring(2)) // 매 시간마다 증가
versionName "1.0.${buildTime.substring(8, 10)}"
```

**자동 증가 예시:**
- 오후 2시 빌드: `versionCode 25013114`
- 오후 3시 빌드: `versionCode 25013115` ✅ (더 높은 버전)

## 2️⃣ 완전한 재빌드 방법

### 방법 A: 스크립트 사용 (권장)

```bash
cd co-show/android

# 1. 빌드 캐시 정리
chmod +x CLEAN_BUILD.sh
./CLEAN_BUILD.sh

# 2. 재빌드
./gradlew assembleDebug

# 3. APK 위치
# android/app/build/outputs/apk/debug/app-debug.apk
```

### 방법 B: 수동 정리

```bash
cd co-show/android

# 1. Gradle 캐시 정리
./gradlew clean

# 2. 빌드 디렉토리 삭제
rm -rf app/build/
rm -rf build/

# 3. 재빌드
./gradlew assembleDebug
```

### 방법 C: Android Studio 사용

1. **Build → Clean Project**
2. **Build → Rebuild Project**
3. **Build → Build Bundle(s) / APK(s) → Build APK(s)**

## 3️⃣ 이전 앱 삭제 후 재설치

### 방법 A: ADB 사용 (권장)

```bash
# 1. 연결된 디바이스 확인
adb devices

# 2. 이전 앱 삭제
adb uninstall com.example.coshowsample

# 3. 새 APK 설치
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### 방법 B: 수동 삭제

1. **디바이스에서 앱 삭제**
   - 설정 → 앱 → co-show → 삭제

2. **새 APK 설치**
   - 파일 탐색기에서 APK 파일 선택 → 설치

## 4️⃣ 강제 재설치 (덮어쓰기)

```bash
# -r 옵션으로 강제 재설치
adb install -r -d app/build/outputs/apk/debug/app-debug.apk
```

옵션 설명:
- `-r`: 기존 앱 덮어쓰기 (데이터 유지)
- `-d`: 버전 코드가 낮아도 덮어쓰기
- `-t`: 테스트 APK 허용

## 5️⃣ 버전 확인

### 빌드된 APK의 버전 확인

```bash
# APK 정보 확인
aapt dump badging app/build/outputs/apk/debug/app-debug.apk | grep versionCode
```

또는

```bash
# Android Studio에서
# Build → Analyze APK → APK 선택 → AndroidManifest.xml 확인
```

### 디바이스에 설치된 앱 버전 확인

```bash
adb shell dumpsys package com.example.coshowsample | grep versionCode
```

## 6️⃣ 빠른 재빌드 & 재설치 스크립트

`REBUILD_AND_INSTALL.sh` 파일 생성:

```bash
#!/bin/bash
cd "$(dirname "$0")"

echo "🧹 빌드 캐시 정리..."
./gradlew clean
rm -rf app/build/

echo "🔨 APK 빌드 중..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    echo "✅ 빌드 완료: $APK_PATH"
    echo ""
    echo "📱 설치 중..."
    adb install -r -d "$APK_PATH"
else
    echo "❌ 빌드 실패"
    exit 1
fi
```

사용:
```bash
chmod +x REBUILD_AND_INSTALL.sh
./REBUILD_AND_INSTALL.sh
```

## ✅ 체크리스트

빌드 전:
- [ ] `versionCode`가 증가했는지 확인 (자동)
- [ ] 빌드 캐시 정리 (`./gradlew clean`)

설치 전:
- [ ] 이전 앱 삭제 (`adb uninstall com.example.coshowsample`)
- [ ] 또는 강제 재설치 (`adb install -r -d`)

빌드 후:
- [ ] APK 버전 코드 확인
- [ ] 디바이스에 설치된 버전 확인

## 🔍 문제 해결

### 여전히 이전 버전이 설치되는 경우

1. **버전 코드 확인**
   ```bash
   # APK의 versionCode 확인
   aapt dump badging app-debug.apk | grep versionCode
   
   # 설치된 앱의 versionCode 확인
   adb shell dumpsys package com.example.coshowsample | grep versionCode
   ```

2. **완전 삭제 후 재설치**
   ```bash
   # 완전 삭제 (데이터 포함)
   adb shell pm clear com.example.coshowsample
   adb uninstall com.example.coshowsample
   
   # 재설치
   adb install -r -d app-debug.apk
   ```

3. **빌드 시간 확인**
   - 같은 시간대에 빌드하면 `versionCode`가 같을 수 있음
   - 최소 1시간 이상 간격을 두고 빌드

4. **수동으로 versionCode 증가**
   ```gradle
   // build.gradle에서
   versionCode 2  // 직접 숫자 증가
   versionName "1.0.1"
   ```

## 📝 참고

- `versionCode`: 정수, 반드시 증가해야 함 (Google Play Store 업데이트 기준)
- `versionName`: 문자열, 사용자에게 표시되는 버전 (예: "1.0.1")

