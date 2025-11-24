import { createCanvas, registerFont } from "canvas";
import path from "path";
import { fileURLToPath } from "url";

// 讓 ESM 取得 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 載入 Unown 字體（你上傳的那個）
registerFont(path.join(__dirname, "../fonts/Unown.ttf"), {
  family: "UnownFont",
});

export async function handleMessage(text) {
  const width = 800;
  const height = 200;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  ctx.font = "72px UnownFont";
  ctx.fillStyle = "#000000";
  ctx.fillText(text, 50, 120);

  // 回傳 PNG buffer
  return canvas.toBuffer("image/png");
}
