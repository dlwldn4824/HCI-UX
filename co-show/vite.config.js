import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // 로봇/스마트폰 등 외부 기기 접속 허용
    port: 5173,        // 원하는 포트 (기본은 5173)
    proxy: {
      "/api": {
        target: "http://172.100.5.169:5173/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});