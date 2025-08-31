// /index.cjs  — Render 부팅용 얇은 런처(bootloader)
// 역할: (1) 필수 미들웨어 세팅, (2) /dist 정적 제공, (3) 기존 서버(app.cjs) 연결

const path = require("path");
const fs = require("fs");
const express = require("express");
const compression = require("compression");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const app = express();

// 기본 보안/성능 (앱이 이미 사용 중이면 중복 적용해도 문제 없음)
app.use(compression());
app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// 헬스체크 (Render가 상태 확인)
app.get("/healthz", (_req, res) => res.send("ok"));

// 1) 기존 거대한 서버(app.cjs) 붙이기
//    - server/app.cjs에서 module.exports = function mount(app) { ... } 형태로
//      Express 라우트들을 app에 붙인다고 가정합니다.
//    - 만약 app.cjs가 자체적으로 app.listen을 호출한다면, 그 부분을 주석 처리하세요 (중복 리슨 금지).
const mountPath = path.join(process.cwd(), "server", "app.cjs");
if (fs.existsSync(mountPath)) {
  const mount = require(mountPath);
  if (typeof mount === "function") {
    mount(app);
  }
}

// 2) 정적 파일 (Vite 빌드 결과물) — 프론트엔드가 있을 때만 사용
const distDir = path.join(process.cwd(), "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // SPA fallback: API 외 모든 경로는 index.html
  app.get("*", (req, res, next) => {
    // API 요청은 통과
    if (req.path.startsWith("/api/")) return next();
    const html = path.join(distDir, "index.html");
    if (fs.existsSync(html)) return res.sendFile(html);
    return next();
  });
}

// 서버 시작 (중복 listen 금지: 이 파일에서만 listen!)
app.listen(PORT, () => {
  console.log(`[boot] Server listening on ${PORT}`);
});
