import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";

// 클라이언트 타입 구분
type ClientType = "web" | "temi";

interface SocketWithType extends Socket {
  clientType?: ClientType;
}

/**
 * WebSocket 서버 초기화
 * React.js 웹 클라이언트와 Temi Android 앱 간의 메시지 중계
 */
export function initializeWebSocket(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*", // 개발 환경용, 프로덕션에서는 특정 origin 지정 권장
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 연결된 클라이언트 관리
  const webClients = new Set<SocketWithType>();
  const temiClients = new Set<SocketWithType>();

  io.on("connection", (socket: SocketWithType) => {
    console.log(`🔌 새 클라이언트 연결: ${socket.id}`);

    // 클라이언트 타입 등록 (웹 또는 Temi)
    socket.on("register", (data: { type: ClientType }) => {
      socket.clientType = data.type;
      
      if (data.type === "web") {
        webClients.add(socket);
        console.log(`🌐 웹 클라이언트 등록: ${socket.id}`);
      } else if (data.type === "temi") {
        temiClients.add(socket);
        console.log(`🤖 Temi 클라이언트 등록: ${socket.id}`);
      }

      // 등록 확인 응답
      socket.emit("registered", { success: true, type: data.type });
    });

    // ============================================
    // React.js 웹 → Temi Android 명령 전달
    // ============================================

    /**
     * 특정 위치로 이동
     * React.js: socket.emit("goTo", { target: "kitchen" })
     * → Temi: "temi_goTo" 이벤트로 전달
     */
    socket.on("goTo", (data: { target: string }) => {
      console.log(`📍 이동 명령 수신: ${data.target}`);
      // 모든 Temi 클라이언트에 전달
      temiClients.forEach((temiSocket) => {
        temiSocket.emit("temi_goTo", data);
      });
    });

    /**
     * 말하기
     * React.js: socket.emit("speak", { text: "안녕하세요" })
     * → Temi: "temi_speak" 이벤트로 전달
     */
    socket.on("speak", (data: { text: string }) => {
      console.log(`💬 말하기 명령 수신: ${data.text}`);
      temiClients.forEach((temiSocket) => {
        temiSocket.emit("temi_speak", data);
      });
    });

    /**
     * 팔로우 모드 시작
     * React.js: socket.emit("startFollow")
     * → Temi: "temi_startFollow" 이벤트로 전달
     */
    socket.on("startFollow", () => {
      console.log(`👥 팔로우 모드 시작 명령 수신`);
      temiClients.forEach((temiSocket) => {
        temiSocket.emit("temi_startFollow");
      });
    });

    /**
     * 팔로우 모드 중지
     * React.js: socket.emit("stopFollow")
     * → Temi: "temi_stopFollow" 이벤트로 전달
     */
    socket.on("stopFollow", () => {
      console.log(`🛑 팔로우 모드 중지 명령 수신`);
      temiClients.forEach((temiSocket) => {
        temiSocket.emit("temi_stopFollow");
      });
    });

    /**
     * 이동 정지
     * React.js: socket.emit("stopMovement")
     * → Temi: "temi_stopMovement" 이벤트로 전달
     */
    socket.on("stopMovement", () => {
      console.log(`⏹️ 이동 정지 명령 수신`);
      temiClients.forEach((temiSocket) => {
        temiSocket.emit("temi_stopMovement");
      });
    });

    /**
     * 로봇 상태 요청
     * React.js: socket.emit("getStatus")
     * → Temi: "temi_getStatus" 이벤트로 전달
     */
    socket.on("getStatus", () => {
      console.log(`📊 상태 요청 수신`);
      temiClients.forEach((temiSocket) => {
        temiSocket.emit("temi_getStatus");
      });
    });

    // ============================================
    // Temi Android → React.js 웹 이벤트 전달
    // ============================================

    /**
     * Temi 로봇 상태 업데이트
     * Temi: socket.emit("temi_status", { battery: 80, location: "kitchen" })
     * → 웹: "status" 이벤트로 전달
     */
    socket.on("temi_status", (data: { battery?: number; location?: string; isMoving?: boolean }) => {
      console.log(`📊 Temi 상태 업데이트:`, data);
      webClients.forEach((webSocket) => {
        webSocket.emit("status", data);
      });
    });

    /**
     * Temi 목적지 도착 이벤트
     * Temi: socket.emit("temi_arrived", { target: "kitchen" })
     * → 웹: "arrived" 이벤트로 전달
     */
    socket.on("temi_arrived", (data: { target: string }) => {
      console.log(`✅ Temi 도착: ${data.target}`);
      webClients.forEach((webSocket) => {
        webSocket.emit("arrived", data);
      });
    });

    /**
     * Temi 사람 감지 이벤트
     * Temi: socket.emit("temi_personDetected", { distance: 1.5 })
     * → 웹: "personDetected" 이벤트로 전달
     */
    socket.on("temi_personDetected", (data: { distance?: number }) => {
      console.log(`👤 사람 감지:`, data);
      webClients.forEach((webSocket) => {
        webSocket.emit("personDetected", data);
      });
    });

    /**
     * Temi 에러 이벤트
     * Temi: socket.emit("temi_error", { message: "이동 실패" })
     * → 웹: "error" 이벤트로 전달
     */
    socket.on("temi_error", (data: { message: string; code?: string }) => {
      console.error(`❌ Temi 에러:`, data);
      webClients.forEach((webSocket) => {
        webSocket.emit("error", data);
      });
    });

    // 연결 해제 처리
    socket.on("disconnect", () => {
      console.log(`🔌 클라이언트 연결 해제: ${socket.id}`);
      
      if (socket.clientType === "web") {
        webClients.delete(socket);
        console.log(`🌐 웹 클라이언트 제거: ${socket.id}`);
      } else if (socket.clientType === "temi") {
        temiClients.delete(socket);
        console.log(`🤖 Temi 클라이언트 제거: ${socket.id}`);
      }
    });
  });

  console.log("🔌 WebSocket 서버 초기화 완료");
  return io;
}

