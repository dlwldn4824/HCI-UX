import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import multer from "multer";
import fs from "fs";

import phoneRouter from "./apis/phone";
import inquiryRouter from "./apis/inquiry";
import uploadRouter from "./apis/upload";

const app = express();

// 기본 미들웨어
app.use(express.json());
app.use(cors({ origin: true, credentials: true })); // 개발 편의용,  origin: ["http://localhost:5173", "http://222.232.30.11:4000"]
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

// 정적 제공 (업로드 파일 접근)
const uploadsPath = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// 업로드 설정 (예시 구조용)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsPath),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// 프론트에서 쓰는 업로드 API (예시 구조)
app.post("/upload-photo", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // 실제 배포 환경 기준 URL 만들기
  // 환경 변수에서 도메인 가져오기 (없으면 기본값 사용)
  const baseUrl = process.env.API_BASE_URL || "https://tellme-api.kwidea.com";
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
  return res.json({ url: fileUrl });
});

// 라우터
app.use("/api/phone-registrations", phoneRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/uploads", uploadRouter);

// 헬스체크
app.get("/", (_req, res) => res.send("Backend OK"));
app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;
