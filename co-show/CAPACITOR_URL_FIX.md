# 🔧 Capacitor URL 설정 수정 가이드

## 문제: 앱이 로컬 링크 대신 프로덕션 도메인을 사용해야 함

현재 상황:
- ✅ `capacitor.config.json` 수정 완료: `https://tellme.kwidea.com/`
- ⚠️ Android assets에 이전 설정이 캐시되어 있을 수 있음

## 해결 방법

### 1️⃣ Capacitor 설정 동기화

```bash
cd co-show

# 1. React 빌드 (최신 코드로 dist 폴더 생성)
npm run build

# 2. Capacitor 동기화 (설정을 Android로 복사)
npx cap sync android
```

이 명령어가:
- `capacitor.config.json` → `android/app/src/main/assets/capacitor.config.json`로 복사
- 최신 `dist` 폴더를 Android assets로 복사

### 2️⃣ Android 앱 재빌드

```bash
cd android

# 빌드 캐시 정리
./gradlew clean

# APK 빌드
./gradlew assembleDebug
```

### 3️⃣ (선택) 빠른 스크립트 사용

이미 생성된 스크립트 사용:

```bash
cd co-show/android
./SYNC_CAPACITOR.sh
```

## ✅ 확인 사항

### 1. capacitor.config.json 확인

`co-show/capacitor.config.json`:
```json
{
  "server": {
    "androidScheme": "https",
    "url": "https://tellme.kwidea.com/",
    "cleartext": false
  }
}
```

### 2. Android assets 확인

`android/app/src/main/assets/capacitor.config.json`:
- `npx cap sync android` 실행 후 자동으로 업데이트됨
- 수동으로 확인하려면 파일 열어서 URL 확인

### 3. MainActivity.java 확인

현재 하드코딩된 URL:
```java
webView.loadUrl("https://tellme.kwidea.com/");
```
✅ 이미 올바른 URL로 설정되어 있음

## 🔍 문제 해결

### 여전히 로컬 URL이 나타나는 경우

1. **Android assets 폴더 확인**
   ```bash
   cat android/app/src/main/assets/capacitor.config.json
   ```
   - URL이 `https://tellme.kwidea.com/`인지 확인

2. **완전한 재빌드**
   ```bash
   cd co-show/android
   ./CLEAN_BUILD.sh  # 빌드 캐시 정리
   cd ..
   npm run build
   npx cap sync android
   cd android
   ./gradlew assembleDebug
   ```

3. **앱 완전 삭제 후 재설치**
   ```bash
   adb uninstall com.example.coshowsample
   adb install -r -d app/build/outputs/apk/debug/app-debug.apk
   ```

## 📝 주의사항

- `MainActivity.java`에서 하드코딩된 URL을 사용하고 있으므로, `capacitor.config.json`보다 우선됩니다
- 현재는 하드코딩된 URL이 이미 올바르게 설정되어 있어서 문제 없지만, 나중에 URL을 변경하려면 두 곳 모두 수정해야 합니다

## 🔄 URL 변경 시 체크리스트

- [ ] `co-show/capacitor.config.json` 수정
- [ ] `npx cap sync android` 실행
- [ ] `android/app/src/main/java/com/example/MainActivity.java` 확인/수정
- [ ] Android 앱 재빌드
- [ ] APK 재설치

