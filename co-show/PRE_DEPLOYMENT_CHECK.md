# 📋 배포 전 확인 가이드

배포를 하지 않고도 코드가 잘 작동하는지 확인하는 방법입니다.

## 🔍 현재 상황

테스트 결과:
- ✅ 서버 상태 확인: `Backend OK` (서버는 작동 중)
- ❌ `/photo/upload` 엔드포인트: 404 에러 (아직 구현되지 않음)
- ❌ `/photo/download` 엔드포인트: 404 에러 (아직 구현되지 않음)

**결론**: 백엔드 API 엔드포인트가 아직 구현되지 않았거나 다른 경로를 사용하고 있습니다.

## ✅ 확인 방법

### 1. 백엔드 API 문서 확인

백엔드 팀에게 다음을 확인하세요:

1. **API 엔드포인트 경로**
   - 현재 코드: `/photo/upload?key=1`
   - 실제 경로가 다른가요?

2. **API 베이스 URL**
   - 현재 코드: `https://tellme-api.kwidea.com`
   - 올바른 URL인가요?

3. **인증 방법**
   - API 키가 필요한가요?
   - 헤더에 특정 토큰이 필요한가요?

4. **요청/응답 형식**
   - 업로드 URL 요청 형식
   - Presigned URL 형식
   - QR 코드 다운로드 응답 형식

### 2. 코드 검증 (정적 분석)

#### PhotoFilter.jsx 코드 구조 확인

**✅ 잘 작성된 부분:**
- [x] 에러 처리가 모든 단계에 포함됨
- [x] 로딩 상태 표시 (스피너)
- [x] 콘솔 로그로 디버깅 가능
- [x] try-catch로 예외 처리
- [x] 사용자 피드백 (alert)

**⚠️ 확인 필요한 부분:**
- [ ] API 엔드포인트 경로가 실제 백엔드와 일치하는지
- [ ] HTTP 메서드가 올바른지 (GET, PUT)
- [ ] 헤더 형식이 올바른지
- [ ] 키 파라미터(`key=1`)가 올바른지

### 3. 브라우저에서 테스트

#### 방법 1: 브라우저 콘솔

1. 웹사이트 열기 (`https://tellme.kwidea.com` 또는 로컬)
2. 개발자 도구(F12) → Console 열기
3. `browser-api-test.js` 파일 내용 붙여넣기
4. 자동 테스트 실행 확인

또는 개별 함수 실행:
```javascript
// 업로드 URL 테스트
testPhotoUpload()

// QR 코드 다운로드 테스트
testQRDownload()

// 전체 플로우 테스트 (작은 이미지 업로드 포함)
testFullFlow()
```

#### 방법 2: 네트워크 탭 확인

1. 개발자 도구(F12) → Network 탭 열기
2. PhotoFilter 페이지에서 "촬영하기" 버튼 클릭
3. 네트워크 요청 확인:
   - 요청 URL이 올바른지
   - HTTP 상태 코드 확인
   - 응답 내용 확인
   - 에러 메시지 확인

### 4. Mock 데이터로 테스트

백엔드가 준비되지 않았을 때, Mock 서버를 만들어 테스트할 수 있습니다:

```javascript
// PhotoFilter.jsx에 임시 테스트 모드 추가
const TEST_MODE = true; // 배포 전에 true로 설정

const getUploadUrl = async (key = "1") => {
  if (TEST_MODE) {
    // Mock 응답
    console.log("🧪 테스트 모드: Mock 업로드 URL 반환");
    return "https://example.com/upload/path?signature=mock";
  }
  
  // 실제 API 호출
  const res = await fetch(`${API_BASE_URL}/photo/upload?key=${key}`);
  // ...
};
```

### 5. 코드 리뷰 체크리스트

`CODE_REVIEW_CHECKLIST.md` 파일을 참고하여 다음을 확인:

- [ ] API 엔드포인트 확인
- [ ] 플로우 검증
- [ ] 잠재적 문제점 확인
- [ ] 테스트 시나리오 검토
- [ ] 로깅 확인

### 6. 백엔드 팀과 협의

다음 정보를 백엔드 팀에 요청:

1. **API 명세서**
   - 엔드포인트 목록
   - 요청/응답 형식
   - 인증 방법

2. **테스트 환경**
   - 테스트용 API URL
   - 테스트용 API 키

3. **예제 코드**
   - 실제 작동하는 예제 요청
   - 성공 응답 예제

## 🚀 다음 단계

### 백엔드 API가 준비되지 않은 경우

1. **임시 Mock 서버 사용**
   - 간단한 Express 서버로 Mock API 구현
   - 같은 엔드포인트로 응답하도록 설정

2. **코드 검증 완료**
   - 코드 구조가 올바른지 확인
   - 에러 처리가 적절한지 확인
   - 로직이 올바른지 확인

3. **백엔드 API 준비 대기**
   - 백엔드 팀과 협의하여 API 명세 확인
   - API 준비되면 URL만 변경

### 백엔드 API가 준비된 경우

1. **테스트 스크립트 실행**
   ```bash
   cd co-show
   ./test-api.sh
   ```

2. **브라우저에서 테스트**
   - 브라우저 콘솔에서 `browser-api-test.js` 실행
   - 네트워크 탭에서 요청 확인

3. **실제 이미지 업로드 테스트**
   - PhotoFilter 페이지에서 실제로 사진 촬영
   - 전체 플로우 확인

## 📝 체크리스트

배포 전 최종 확인:

- [ ] 백엔드 API 엔드포인트가 준비되었는지
- [ ] API URL이 올바른지 (`https://tellme-api.kwidea.com`)
- [ ] 코드 문법 오류가 없는지 (`npm run lint`)
- [ ] 빌드가 성공하는지 (`npm run build`)
- [ ] 에러 처리가 모든 단계에 있는지
- [ ] 사용자 피드백이 적절한지 (로딩, 에러 메시지)
- [ ] 콘솔 로그가 적절한지 (디버깅용)
- [ ] CORS 헤더가 설정되어 있는지 (백엔드)

## 🔧 문제 해결

### 404 에러가 발생하는 경우

1. **엔드포인트 경로 확인**
   - 실제 백엔드 경로와 비교
   - 대소문자, 슬래시, 쿼리 파라미터 확인

2. **API 베이스 URL 확인**
   - 올바른 도메인인지
   - HTTPS가 올바르게 설정되었는지

3. **백엔드 서버 상태 확인**
   - 서버가 실행 중인지
   - 해당 엔드포인트가 구현되었는지

### CORS 에러가 발생하는 경우

1. **백엔드에서 CORS 헤더 설정 요청**
   ```javascript
   // Express 예제
   app.use(cors({
     origin: 'https://tellme.kwidea.com',
     credentials: true
   }));
   ```

2. **프록시 사용 고려**
   - Vercel 서버리스 함수로 프록시
   - 또는 Nginx 리버스 프록시

## 💡 권장사항

1. **백엔드 API 명세서 확보**
   - OpenAPI/Swagger 문서
   - 또는 상세한 README

2. **통합 테스트 환경 구축**
   - 테스트용 API 서버
   - E2E 테스트 코드

3. **에러 모니터링**
   - Sentry 등으로 에러 추적
   - 사용자 피드백 수집

