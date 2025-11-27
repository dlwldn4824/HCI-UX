# ⚠️ Gradle 경고 메시지 설명

## 경고 메시지

```
WARNING: A restricted method in java.lang.System has been called
WARNING: java.lang.System::load has been called by net.rubygrapefruit.platform.internal.NativeLibraryLoader
WARNING: Use --enable-native-access=ALL-UNNAMED to avoid a warning for callers in this module
```

## 이게 뭔가요?

이것은 **Java 17+ 환경에서 Gradle이 네이티브 라이브러리를 로드할 때** 나타나는 경고입니다.

### 특징
- ✅ **빌드에는 영향 없음** - 경고일 뿐, 실제 빌드는 정상적으로 진행됨
- ✅ **Gradle 자체의 문제** - 우리 코드와는 무관
- ⚠️ **미래 Java 버전에서 제한될 수 있음** - 하지만 당장은 문제 없음

## 해결 방법

### 방법 1: 무시하기 (권장)
- 빌드는 정상적으로 작동하므로 **무시해도 됩니다**
- 경고만 나타날 뿐 실제 문제는 없음

### 방법 2: 경고 숨기기 (선택사항)

`gradle.properties` 파일에 이미 추가했습니다:

```properties
org.gradle.jvmargs=-Xmx1536m --enable-native-access=ALL-UNNAMED
```

이제 다음 빌드부터 경고가 사라집니다.

## 확인

다시 빌드해보세요:

```bash
cd android
./gradlew clean
```

경고가 사라졌는지 확인하세요.

## 참고

- 이 경고는 Java 17+ 모듈 시스템의 보안 기능
- Gradle이 네이티브 라이브러리를 로드하기 위해 필요함
- `--enable-native-access=ALL-UNNAMED` 플래그로 명시적으로 허용 가능

