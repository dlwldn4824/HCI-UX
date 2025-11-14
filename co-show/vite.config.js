import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 레포 이름으로 변경 (예: repo 이름이 'co-show' 라면 "/co-show/")
  base: "/HCI-UX/",
});
