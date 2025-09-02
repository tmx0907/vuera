// /index.cjs — Render 부팅용 얇은 런처

const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");
const express = require("express");
const compression = require("compression");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const app = express();

// 기본 보안/성능
app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: false }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// 헬스체크
app.get("/healthz", (_req, res) => res.send("ok"));

// --- server/app.mjs 동적 로드 ---
async function mountServerCode() {
  const mjsPath = path.join(process.cwd(), "server", "app.mjs");
  if (!fs.existsSync(mjsPath)) return; // 프론트만 서빙하는 경우 대비

  const mod = await import(pathToFileURL(mjsPath).href);
  const mount = mod.default || mod.mount || mod;
  if (typeof mount === "function") {
    await Promise.resolve(mount(app)); // 라우트/미들웨어 부착
  }
}

// --- (선택) Vite 빌드 결과 정적 서빙 ---
function setupStatic() {
  const distDir = path.join(process.cwd(), "dist");
  if (!fs.existsSync(distDir)) return;

  app.use(express.static(distDir));
  // SPA fallback (API 경로 제외)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    const html = path.join(distDir, "index.html");
    if (fs.existsSync(html)) return res.sendFile(html);
    return next();
  });
}

// 부팅 순서 보장
(async () => {
  await mountServerCode();
  setupStatic();

  // 서버 시작 (여기서만 listen!)
  app.listen(PORT, () => {
    console.log(`[boot] Server listening on ${PORT}`);
  });
})().catch(err => {
  console.error("Boot failed:", err);
  process.exit(1);
});

