import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: "https://canvas-whiteboard-and-document-editor.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
