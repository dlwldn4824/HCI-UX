# 🔧 Java 버전 호환성 문제 해결

## ❌ 에러 메시지

```
Unsupported class file major version 69
```

이것은 **Java 25 호환성 문제**입니다.

## 🔍 원인

- 시스템에 **Java 25**가 설치되어 있음
- Gradle 8.13이 Java 25를 완전히 지원하지 않을 수 있음
- Capacitor 플러그인 중 일부가 Java 25와 호환되지 않을 수 있음

## ✅ 해결 방법

### 방법 1: Java 17 또는 21 설치 및 사용 (권장)

#### 1. Java 17 또는 21 설치

**Homebrew 사용:**
```bash
# Java 21 설치 (권장)
brew install openjdk@21

# 또는 Java 17 설치
brew install openjdk@17
```

#### 2. 설치된 Java 확인

```bash
/usr/libexec/java_home -V
```

출력 예시:
```
Matching Java Virtual Machines (2):
    25.0.1 (arm64) "Eclipse Adoptium" - "OpenJDK 25.0.1"
    21.0.x (arm64) "Eclipse Adoptium" - "OpenJDK 21.0.x"  # 새로 설치된 것
```

#### 3. Gradle이 Java 21을 사용하도록 설정

`gradle.properties`에 추가:

```properties
# Java 21 사용 (Java 17도 가능)
org.gradle.java.home=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
```

정확한 경로 확인:
```bash
/usr/libexec/java_home -v 21
```

### 방법 2: Java Toolchain 설정 (임시 해결)

`build.gradle`에 Java Toolchain 설정 추가:

```gradle
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)  // 또는 21
    }
}
```

하지만 이 방법은 완전한 해결책이 아닐 수 있습니다.

### 방법 3: Gradle 업그레이드 (장기 해결)

Gradle을 최신 버전으로 업그레이드하면 Java 25 지원이 개선될 수 있습니다.

## 🚀 빠른 해결 (임시)

일단 Java 17 또는 21을 설치하지 않고도 시도할 수 있는 방법:

### Gradle Daemon 재시작

```bash
cd android
./gradlew --stop  # Gradle Daemon 중지
./gradlew clean   # 다시 시도
```

### 빌드 캐시 완전 삭제

```bash
cd android
rm -rf .gradle/
rm -rf build/
rm -rf app/build/
./gradlew clean
```

## 📝 추천 순서

1. **Java 21 설치** (가장 확실한 방법)
   ```bash
   brew install openjdk@21
   /usr/libexec/java_home -v 21  # 경로 확인
   ```
   
2. **gradle.properties 수정**
   ```properties
   org.gradle.java.home=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
   ```

3. **Gradle Daemon 재시작**
   ```bash
   ./gradlew --stop
   ./gradlew clean
   ```

## 🔍 Java 버전 확인

```bash
# 현재 사용 중인 Java 버전
java -version

# 설치된 모든 Java 버전
/usr/libexec/java_home -V

# 특정 버전의 경로
/usr/libexec/java_home -v 21
```

## ⚠️ 참고

- Java 25는 최신 버전이라 일부 도구와 호환되지 않을 수 있습니다
- Android 개발에는 **Java 17 또는 21**을 권장합니다
- Java 25는 나중에 도구들이 지원이 개선되면 사용할 수 있습니다

