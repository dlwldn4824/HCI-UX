# 🔧 Vercel 404 에러 해결

Vercel 배포 후 404 에러가 발생하는 문제를 해결했습니다.

## ✅ 수정 사항

### 1. `vercel.config` - SPA 라우팅 추가
```json
{
  "rewrites": [
    // ... 기존 rewrites ...
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

이 설정으로 모든 경로가 `index.html`로 리다이렉트되어 React Router가 클라이언트 사이드에서 라우팅을 처리할 수 있습니다.

### 2. `vite.config.js` - base 경로 수정
```javascript
base: "/"  // Vercel 배포 시 절대 경로 사용
```

**이전:** `base: "./"` (상대 경로)
**수정 후:** `base: "/"` (절대 경로)

## 🔍 문제 원인

1. **SPA 라우팅 미설정**: Vercel이 모든 경로를 `index.html`로 리다이렉트하지 않아서 404 발생
2. **상대 경로 사용**: `base: "./"`로 인해 정적 파일 경로가 잘못됨

## ✅ 해결 방법

### 1. 설정 파일 수정 완료
- ✅ `vercel.config`에 SPA 라우팅 추가
- ✅ `vite.config.js`의 `base`를 `/`로 변경

### 2. 재빌드 및 재배포

```bash
cd co-show

# 1. 빌드
npm run build

# 2. Vercel 배포
npx vercel --prod --yes
```

또는 GitHub에 push하면 자동 배포됩니다:
```bash
git add .
git commit -m "Fix Vercel 404 error - Add SPA routing"
git push
```

## 📝 Hash Router 사용 중

현재 `createHashRouter`를 사용하고 있어서:
- URL 형태: `https://hci-ux.vercel.app/#/photo/filter`
- Hash Router는 클라이언트 사이드 라우팅이므로 서버 설정이 덜 중요하지만, 루트 경로(`/`)는 제대로 작동해야 합니다.

## ✅ 확인 사항

배포 후 다음을 확인하세요:

1. **루트 경로 접속:**
   ```
   https://hci-ux.vercel.app/
   ```
   - 정상적으로 메인 페이지가 표시되어야 함

2. **Hash 라우팅:**
   ```
   https://hci-ux.vercel.app/#/photo/filter
   ```
   - 정상적으로 해당 페이지가 표시되어야 함

3. **직접 URL 접근:**
   ```
   https://hci-ux.vercel.app/#/map
   ```
   - 404 없이 정상 작동해야 함

## 🔍 추가 문제 해결

여전히 404가 발생한다면:

1. **빌드 확인:**
   ```bash
   npm run build
   ls -la dist/
   ```
   - `dist/index.html`이 존재하는지 확인

2. **Vercel 로그 확인:**
   - Vercel Dashboard → Deployments → 해당 배포 → Functions Logs
   - 에러 메시지 확인

3. **캐시 클리어:**
   - 브라우저 캐시 클리어
   - Vercel에서 재배포

