import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",          // 🔴 이 줄이 중요! (상대 경로로 빌드)
});