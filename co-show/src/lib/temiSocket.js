import { io } from "socket.io-client";

/**
 * Temi 로봇 제어를 위한 WebSocket 클라이언트
 * React.js에서 서버로 명령을 보내고, Temi 로봇의 이벤트를 수신합니다.
 */

class TemiSocketClient {
  constructor(serverUrl = "http://localhost:4000") {
    this.socket = null;
    this.serverUrl = serverUrl;
    this.isConnected = false;
    this.listeners = new Map();
  }

  /**
   * 서버에 연결
   */
  connect() {
    if (this.socket?.connected) {
      console.warn("이미 연결되어 있습니다.");
      return;
    }

    this.socket = io(this.serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // 연결 이벤트
    this.socket.on("connect", () => {
      console.log("🔌 WebSocket 서버에 연결됨");
      this.isConnected = true;
      
      // 클라이언트 타입 등록 (웹)
      this.socket.emit("register", { type: "web" });
    });

    // 등록 확인
    this.socket.on("registered", (data) => {
      console.log("✅ 서버에 등록됨:", data);
    });

    // 연결 해제
    this.socket.on("disconnect", () => {
      console.log("🔌 WebSocket 연결 해제");
      this.isConnected = false;
    });

    // 에러 처리
    this.socket.on("connect_error", (error) => {
      console.error("❌ WebSocket 연결 오류:", error);
      this.isConnected = false;
    });

    // 기존 리스너 등록
    this.setupDefaultListeners();
  }

  /**
   * 기본 이벤트 리스너 설정
   */
  setupDefaultListeners() {
    // Temi 상태 업데이트
    this.socket.on("status", (data) => {
      console.log("📊 Temi 상태:", data);
      this.emit("status", data);
    });

    // 목적지 도착
    this.socket.on("arrived", (data) => {
      console.log("✅ Temi 도착:", data);
      this.emit("arrived", data);
    });

    // 사람 감지
    this.socket.on("personDetected", (data) => {
      console.log("👤 사람 감지:", data);
      this.emit("personDetected", data);
    });

    // 에러
    this.socket.on("error", (data) => {
      console.error("❌ Temi 에러:", data);
      this.emit("error", data);
    });
  }

  /**
   * 커스텀 이벤트 리스너 등록
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * 커스텀 이벤트 리스너 제거
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * 커스텀 이벤트 발생
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        callback(data);
      });
    }
  }

  /**
   * 특정 위치로 이동
   * @param {string} target - 이동할 위치 (예: "kitchen", "living_room")
   */
  goTo(target) {
    if (!this.isConnected) {
      console.error("서버에 연결되지 않았습니다.");
      return;
    }
    console.log(`📍 이동 명령 전송: ${target}`);
    this.socket.emit("goTo", { target });
  }

  /**
   * 텍스트 말하기
   * @param {string} text - 말할 텍스트
   */
  speak(text) {
    if (!this.isConnected) {
      console.error("서버에 연결되지 않았습니다.");
      return;
    }
    console.log(`💬 말하기 명령 전송: ${text}`);
    this.socket.emit("speak", { text });
  }

  /**
   * 팔로우 모드 시작
   */
  startFollow() {
    if (!this.isConnected) {
      console.error("서버에 연결되지 않았습니다.");
      return;
    }
    console.log("👥 팔로우 모드 시작");
    this.socket.emit("startFollow");
  }

  /**
   * 팔로우 모드 중지
   */
  stopFollow() {
    if (!this.isConnected) {
      console.error("서버에 연결되지 않았습니다.");
      return;
    }
    console.log("🛑 팔로우 모드 중지");
    this.socket.emit("stopFollow");
  }

  /**
   * 이동 정지
   */
  stopMovement() {
    if (!this.isConnected) {
      console.error("서버에 연결되지 않았습니다.");
      return;
    }
    console.log("⏹️ 이동 정지");
    this.socket.emit("stopMovement");
  }

  /**
   * 로봇 상태 요청
   */
  getStatus() {
    if (!this.isConnected) {
      console.error("서버에 연결되지 않았습니다.");
      return;
    }
    console.log("📊 상태 요청");
    this.socket.emit("getStatus");
  }

  /**
   * 연결 해제
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }
}

// 싱글톤 인스턴스 생성
let temiSocketInstance = null;

/**
 * Temi Socket 클라이언트 인스턴스 가져오기
 * @param {string} serverUrl - 서버 URL (선택사항)
 * @returns {TemiSocketClient}
 */
export function getTemiSocket(serverUrl) {
  if (!temiSocketInstance) {
    temiSocketInstance = new TemiSocketClient(serverUrl);
  }
  return temiSocketInstance;
}

/**
 * React Hook 예제
 */
export function useTemiSocket(serverUrl) {
  const socket = getTemiSocket(serverUrl);

  // 컴포넌트 마운트 시 연결
  if (typeof window !== "undefined" && !socket.isConnected) {
    socket.connect();
  }

  return socket;
}

export default TemiSocketClient;

