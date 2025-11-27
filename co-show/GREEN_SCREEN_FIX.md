# 🔧 초록색 화면(플래시) 방지 수정 완료

Android WebView에서 비디오 재생 시 나타나는 초록색 화면 플래시를 방지하기 위한 수정을 완료했습니다.

## ✅ 적용된 수정 사항

### 1. **onLoadedData 이벤트 사용**
- `onCanPlay`보다 더 안정적인 `onLoadedData` 이벤트를 주요 이벤트로 사용
- 첫 프레임이 완전히 디코딩된 후에만 비디오를 표시
- `onCanPlay`는 백업으로 유지

### 2. **검정 배경 적용**
- 로딩 스피너 배경: `#ffffff` → `#000000` (검정)
- 비디오 요소에 `backgroundColor: "#000000"` 추가
- 초록색 플래시 대신 검정 화면 표시 (더 자연스러움)

### 3. **페이드 인 효과**
- `opacity: videoLoaded ? 1 : 0` 유지
- `transition: "opacity 0.4s ease"`로 부드러운 전환

## 📝 수정된 파일

1. **QuizCorrect.jsx** - 정답 영상
   - Supabase URL: `dance_correct.mp4`, `voice_correct.mp4`

2. **QuizWrong.jsx** - 오답 영상
   - Supabase URL: `dance_wrong.mp4`, `voice_wrong.mp4`

3. **TemiGuide.jsx** - 길 안내 영상
   - Supabase URL: `follow.mov`

## 🔍 작동 원리

### 이전 (초록색 화면 발생 가능)
```
1. 비디오 요소 생성
2. autoPlay 시작
3. 디코더 초기화 중... (초록색 버퍼 노출 가능)
4. 첫 프레임 렌더링
5. onCanPlay 호출 → 비디오 표시
```

### 수정 후 (초록색 화면 방지)
```
1. 비디오 요소 생성 (opacity: 0, backgroundColor: #000)
2. 검정 배경의 로딩 스피너 표시
3. autoPlay 시작 (비디오는 여전히 숨김)
4. 디코더 초기화 중... (비디오가 숨겨져 있어서 초록색 안 보임)
5. onLoadedData 호출 (첫 프레임 완전 디코딩 완료)
6. opacity: 0 → 1 페이드 인
7. 검정 배경 위에 비디오가 부드럽게 나타남
```

## 🎯 예상 효과

- ✅ 초록색 플래시가 거의 보이지 않음
- ✅ 초기 로딩 시 검정 화면으로 자연스럽게 전환
- ✅ 첫 프레임이 완전히 준비된 후에만 비디오 표시
- ✅ 더 부드러운 사용자 경험

## 📌 추가 최적화 (선택 사항)

만약 여전히 초록색 화면이 간헐적으로 보인다면, 다음을 고려할 수 있습니다:

### 1. 영상 파일 재인코딩
```bash
# H.264 Main Profile, yuv420p, 짧은 키프레임 간격
ffmpeg -i input.mp4 \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -x264opts keyint=30:min-keyint=30:scenecut=0 \
  -c:a aac -b:a 128k \
  output_safe.mp4
```

### 2. 비디오 프리로드
현재 `preload="auto"`가 이미 설정되어 있어 추가 설정 불필요합니다.

### 3. 수동 루프 (loop 사용 시)
현재 코드는 `onEnded`로 수동 종료하므로 loop 관련 이슈는 없습니다.

## ✅ 테스트

다음 시나리오에서 테스트해보세요:

1. **정답 영상 (Q1, Q2)**
   - 초록색 화면 없이 검정 화면 → 비디오 페이드 인
   
2. **오답 영상 (Q1, Q2)**
   - 초록색 화면 없이 검정 화면 → 비디오 페이드 인

3. **길 안내 영상**
   - 초록색 화면 없이 검정 화면 → 비디오 페이드 인

## 🔗 참고

이 수정은 Android WebView의 하드웨어 디코더 초기화 구간에서 발생하는 색상 버퍼 잔상을 방지하기 위한 프론트엔드 레벨의 해결책입니다.

