# 🔧 프로덕션 URL 설정 수정 완료

## ✅ 수정된 파일

1. **`co-show/capacitor.config.json`**
   - URL: `https://tellme.kwidea.com/`
   - Scheme: `https`
   - Cleartext: `false`

2. **`android/app/src/main/assets/capacitor.config.json`**
   - URL: `https://tellme.kwidea.com/`
   - Scheme: `https`
   - Cleartext: `false`

3. **`android/app/src/main/java/com/example/MainActivity.java`**
   - 하드코딩된 URL: `https://tellme.kwidea.com/`
   - WebView 캐시 클리어 코드 추가

## 🚀 다음 단계 (필수!)

### 1. React 빌드 및 Capacitor 동기화

```bash
cd co-show

# React 빌드
npm run build

# Capacitor 설정 동기화
npx cap sync android
```

### 2. Android 앱 재빌드

```bash
cd android

# 빌드 캐시 정리
./gradlew clean

# APK 빌드
./gradlew assembleDebug
```

또는 스크립트 사용:

```bash
cd android
./SYNC_CAPACITOR.sh  # React 빌드 + Capacitor 동기화
./CLEAN_BUILD.sh     # 빌드 캐시 정리
./gradlew assembleDebug  # APK 빌드
```

### 3. 앱 완전 삭제 후 재설치

**⚠️ 중요: 이전 앱을 완전히 삭제해야 WebView 캐시도 함께 삭제됩니다!**

```bash
# 1. 연결된 디바이스 확인
adb devices

# 2. 앱 완전 삭제 (데이터 포함)
adb shell pm clear com.example.coshowsample
adb uninstall com.example.coshowsample

# 3. 새 APK 설치
adb install -r -d app/build/outputs/apk/debug/app-debug.apk
```

## 🔍 확인 방법

### 앱 실행 후 로그 확인

```bash
adb logcat | grep "MainActivity\|WEBVIEW_LOG"
```

다음 메시지가 보여야 합니다:
```
MainActivity: Loading URL: https://tellme.kwidea.com/
```

### WebView에서 로드된 URL 확인

앱 실행 후 Chrome DevTools로 연결:
1. Chrome에서 `chrome://inspect` 접속
2. 디바이스에서 앱 실행
3. "WebView" 섹션에서 앱 선택
4. Network 탭에서 로드된 URL 확인

## ⚠️ 문제 해결

### 여전히 로컬 URL이 나타나는 경우

1. **앱 데이터 완전 삭제**
   ```bash
   adb shell pm clear com.example.coshowsample
   ```

2. **앱 완전 삭제 후 재설치**
   ```bash
   adb uninstall com.example.coshowsample
   adb install -r -d app/build/outputs/apk/debug/app-debug.apk
   ```

3. **WebView 캐시 수동 삭제**
   - 디바이스 설정 → 앱 → co-show → 저장공간 → 캐시 삭제

4. **APK 버전 확인**
   - 새로 빌드된 APK인지 확인
   - `versionCode`가 증가했는지 확인

## 📝 체크리스트

- [ ] `capacitor.config.json` URL 확인: `https://tellme.kwidea.com/`
- [ ] `npx cap sync android` 실행
- [ ] Android 앱 재빌드
- [ ] **앱 완전 삭제** (중요!)
- [ ] 새 APK 설치
- [ ] 앱 실행 후 URL 확인

