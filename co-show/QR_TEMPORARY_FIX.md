# 🔧 QR 코드 임시 해결 방법

서버 설정 권한이 없을 때 사용할 수 있는 임시 해결책입니다.

## ⚠️ 주의사항

- Mixed Content 경고가 발생할 수 있습니다
- 브라우저에서 HTTP 요청이 차단될 수 있습니다
- Android WebView에서는 작동할 수 있지만, 일반 브라우저에서는 제한될 수 있습니다

## ✅ 수정 방법

`PhotoFilter.jsx`의 `useProxy()` 함수를 수정:

```javascript
// 프로덕션 환경에서는 Vercel 프록시 사용, 개발 환경에서는 직접 HTTP 접근
const useProxy = () => {
  // 임시: tellme.kwidea.com에서는 API 프록시가 없으므로 직접 접근
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  // Vercel 도메인이 아닌 경우 직접 접근
  if (hostname && !hostname.includes('vercel.app')) {
    return false;  // 직접 HTTP 서버 접근
  }
  
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isProd = import.meta.env.PROD;
  return isHttps || isProd;
};
```

하지만 이 방법은 **보안상 권장되지 않으며**, 최종적으로는 **서버에 API 프록시를 설정**하는 것이 올바른 해결책입니다.

## 🎯 최종 해결책

서버 관리자에게 `NGINX_API_PROXY_CONFIG.md` 파일의 내용을 전달하여 Nginx 프록시 설정을 요청하세요.

