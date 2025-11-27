# 🔧 Vercel 빌드 에러 해결

## 문제
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
* 1 dependencies were added: qrcode@^1.5.4
```

## ✅ 해결 방법

### 1. 로컬에서 pnpm-lock.yaml 업데이트
```bash
cd co-show
pnpm install
```

### 2. 변경사항 커밋 및 푸시
```bash
git add co-show/pnpm-lock.yaml
git commit -m "Update pnpm-lock.yaml for qrcode package"
git push
```

### 3. Vercel 재배포
- Vercel Dashboard에서 수동으로 재배포하거나
- 빈 커밋으로 재배포 트리거:
  ```bash
  git commit --allow-empty -m "Trigger Vercel rebuild"
  git push
  ```

## 📝 Vercel 프로젝트 설정 확인

만약 여전히 빌드가 실패한다면, Vercel 프로젝트 설정을 확인하세요:

1. **Root Directory 설정:**
   - Vercel Dashboard → Settings → General
   - Root Directory가 `co-show`로 설정되어 있는지 확인

2. **Build Command:**
   - Build Command: `cd co-show && pnpm run build`
   - Output Directory: `co-show/dist`

3. **Install Command:**
   - Install Command: `cd co-show && pnpm install`

## ✅ 확인 사항

최신 커밋에 다음이 포함되어 있는지 확인:
- ✅ `co-show/package.json`에 `qrcode: "^1.5.4"` 포함
- ✅ `co-show/pnpm-lock.yaml`에 qrcode 패키지 정보 포함
- ✅ 모든 변경사항이 GitHub에 푸시됨

