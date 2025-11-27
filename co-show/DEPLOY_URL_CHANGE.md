# ✅ 배포 URL 변경 완료

웹 배포 URL을 `https://hci-f0u8gi879-dlwldn4824s-projects.vercel.app/`로 변경했습니다.

## 📝 변경된 파일

### 1. `capacitor.config.json`
```json
{
  "server": {
    "androidScheme": "https",
    "url": "https://hci-f0u8gi879-dlwldn4824s-projects.vercel.app/",
    "cleartext": false
  }
}
```

### 2. `android/app/src/main/java/com/example/MainActivity.java`
- 프로덕션 URL: `https://hci-f0u8gi879-dlwldn4824s-projects.vercel.app/`
- 모든 하드코딩된 URL 변경 완료

### 3. 빌드 완료
- ✅ React 빌드 완료 (`dist` 폴더 생성)
- ✅ Capacitor 동기화 완료 (Android assets 업데이트)

## 🚀 배포 방법

### 방법 1: Vercel CLI로 배포
```bash
cd co-show
npx vercel login  # 처음 한 번만 실행
npx vercel --prod --yes
```

### 방법 2: Vercel Dashboard에서 배포
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. "Deployments" 탭에서 최신 배포 확인
4. 또는 GitHub에 push하면 자동 배포

### 방법 3: GitHub Push (자동 배포)
```bash
git add .
git commit -m "Update deployment URL to Vercel"
git push
```

## ✅ 확인 사항

배포 후 다음을 확인하세요:

1. **웹 브라우저에서 접속:**
   ```
   https://hci-f0u8gi879-dlwldn4824s-projects.vercel.app/
   ```

2. **Android 앱 빌드 (선택사항):**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

3. **Android assets 확인:**
   ```bash
   cat android/app/src/main/assets/capacitor.config.json
   ```
   - URL이 `https://hci-f0u8gi879-dlwldn4824s-projects.vercel.app/`인지 확인

## 📌 참고

- Vercel은 GitHub에 push하면 자동으로 배포됩니다
- 수동 배포가 필요하면 `npx vercel --prod` 사용
- Android 앱은 새 URL로 다시 빌드 필요 (이미 동기화 완료)

