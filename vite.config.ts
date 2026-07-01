import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Dev-only: Vite proxy target for /api/*.
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.DEV_API_TARGET || "http://localhost:8080";
  const portRaw = Number(env.PORT ?? 9000);
  const port = Number.isFinite(portRaw) && portRaw > 0 ? portRaw : 9000;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },
    server: {
      host: true,
      port,
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, "")
        }
      }
    }
  };
});
