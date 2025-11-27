# ✅ 배포 URL 변경 완료

웹 배포 URL을 `https://hci-ux.vercel.app/`로 변경했습니다.

## 📝 변경된 파일

### 1. `capacitor.config.json`
```json
{
  "server": {
    "androidScheme": "https",
    "url": "https://hci-ux.vercel.app/",
    "cleartext": false
  }
}
```

### 2. `android/app/src/main/java/com/example/MainActivity.java`
- 모든 하드코딩된 URL 변경 완료 (4곳)
- 프로덕션 URL: `https://hci-ux.vercel.app/`

### 3. `android/app/src/main/assets/capacitor.config.json`
- Capacitor 동기화로 자동 업데이트 완료

## ✅ 완료된 작업

1. ✅ React 빌드 완료 (`dist` 폴더 생성)
2. ✅ Capacitor 동기화 완료 (Android assets 업데이트)
3. ✅ APK 빌드 완료

## 🚀 배포 방법

### Vercel 자동 배포
GitHub에 push하면 자동으로 배포됩니다:
```bash
git add .
git commit -m "Update deployment URL to https://hci-ux.vercel.app/"
git push
```

### 수동 배포
Vercel Dashboard에서 직접 배포하거나:
- [Vercel Dashboard](https://vercel.com/dashboard) 접속
- 프로젝트 선택 후 "Deployments" 확인

## 📱 APK 정보

- **파일 위치:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **배포 URL:** `https://hci-ux.vercel.app/`
- **생성 시간:** 방금 생성됨

## ✅ 확인 사항

배포 후 다음을 확인하세요:

1. **웹 브라우저:**
   - [https://hci-ux.vercel.app/](https://hci-ux.vercel.app/) 접속 확인

2. **Android 앱:**
   - APK 설치 후 새 URL로 정상 작동 확인

