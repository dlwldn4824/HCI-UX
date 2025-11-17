import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { prisma } from "../prismaClient";
const router = Router();

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// 사진 1장 업로드 (FormData 키: "photo")
router.post("/photo", upload.single("photo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "파일 누락" });

  const { originalname, mimetype, size, filename } = req.file;
  const deviceId = req.body?.deviceId as string | undefined;
  const url = `/uploads/${filename}`;

  const saved = await prisma.photoUpload.create({
    data: { fileName: originalname, mimeType: mimetype, size, url, deviceId },
  });

  res.status(201).json(saved); // { id, url, ... }
});

export default router;
