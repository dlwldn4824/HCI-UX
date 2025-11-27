# 🔧 uploadToServer 에러 해결 완료

## ✅ 수정 사항

`PhotoFilter.jsx`의 `useProxy()` 함수를 수정하여 `tellme.kwidea.com`에서는 API 프록시를 사용하지 않고 직접 HTTP 서버로 접근하도록 변경했습니다.

### 변경 내용

```javascript
const useProxy = () => {
  // tellme.kwidea.com은 API 프록시가 없으므로 직접 접근
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'tellme.kwidea.com' || hostname.includes('kwidea.com')) {
      return false; // API 프록시가 없으므로 직접 접근
    }
  }
  
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isProd = import.meta.env.PROD;
  return isHttps || isProd;
};
```

## ⚠️ 주의사항

### Mixed Content 문제 가능성

HTTPS 페이지(`https://tellme.kwidea.com/`)에서 HTTP 리소스(`http://44.198.30.193:8080`)로 접근하면 브라우저가 Mixed Content 정책에 의해 요청을 차단할 수 있습니다.

**예상되는 에러:**
```
Mixed Content: The page at 'https://tellme.kwidea.com/' was loaded over HTTPS, 
but requested an insecure resource 'http://44.198.30.193:8080/...'. 
This request has been blocked.
```

### 해결 방법

#### 방법 1: Android WebView에서는 작동 가능 (현재 상황)

Android WebView에서는 `cleartext` 설정이 활성화되어 있으면 HTTP 접근이 가능합니다.

`capacitor.config.json`:
```json
{
  "server": {
    "androidScheme": "https",
    "url": "https://tellme.kwidea.com/",
    "cleartext": false  // true로 변경하면 HTTP 접근 가능
  }
}
```

**하지만 현재는 `cleartext: false`이므로 Mixed Content 문제가 발생할 수 있습니다.**

#### 방법 2: Nginx Reverse Proxy 설정 (권장)

서버 관리자에게 `NGINX_API_PROXY_CONFIG.md` 파일의 내용대로 Nginx 프록시 설정을 추가해 달라고 요청하세요.

이렇게 하면:
- `https://tellme.kwidea.com/api/photo/*` → `http://44.198.30.193:8080/photo/*`로 프록시
- 브라우저 입장에서는 HTTPS → HTTPS 요청이므로 Mixed Content 문제 없음

#### 방법 3: Android WebView cleartext 허용 (임시)

`capacitor.config.json`에서 `cleartext: true`로 설정:

```json
{
  "server": {
    "androidScheme": "https",
    "url": "https://tellme.kwidea.com/",
    "cleartext": true  // HTTP 접근 허용
  }
}
```

그리고 Android `AndroidManifest.xml`에도 설정 추가:

```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

## 🔍 테스트

### 1. 브라우저 콘솔 확인

`https://tellme.kwidea.com/#/photo/filter` 접속 후:
1. 개발자 도구 (F12) 열기
2. 콘솔 탭에서 다음 메시지 확인:
   - `📤 업로드 URL 요청: http://44.198.30.193:8080/photo/upload?key=1`
   - Mixed Content 에러가 있는지 확인

### 2. Android 앱에서 테스트

Android 앱에서 사진 촬영 후 QR 코드가 정상적으로 표시되는지 확인하세요.

## 📝 다음 단계

1. **코드 수정 완료** ✅
   - `useProxy()` 함수 수정 완료
   - `tellme.kwidea.com`에서는 직접 HTTP 접근

2. **빌드 및 배포**
   ```bash
   cd co-show
   npm run build
   # dist 폴더를 tellme.kwidea.com 서버에 배포
   ```

3. **테스트**
   - 브라우저에서 Mixed Content 에러 확인
   - Android 앱에서 작동 여부 확인

4. **최종 해결 (권장)**
   - 서버 관리자에게 Nginx 프록시 설정 요청
   - 또는 Android WebView에서 cleartext 허용

