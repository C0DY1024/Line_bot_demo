import { createCanvas, registerFont } from "@napi-rs/canvas";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 載入你的 Unown 字體
registerFont(path.join(__dirname, "../fonts/Unown.ttf"), {
  family: "UnownFont",
});

// 主要處理函式
export async function handleUserMessage(text) {
  text = text.trim();

  // 指令：如果文字是「未知」或 "unown" → 回傳圖片
  if (text.startsWith("unown ")) {
    const userText = text.replace("unown ", "").trim();
    const buffer = await drawUnownText(userText);

    return {
      type: "image",
      buffer,
    };
  }

  // 一般文字 → 回文字即可
  return {
    type: "text",
    text: `你說：${text}`,
  };
}

// 將文字畫成圖片
async function drawUnownText(text) {
  const width = 800;
  const height = 300;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 背景
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // 字體
  ctx.font = "80px UnownFont";
  ctx.fillStyle = "#000000";

  // 置中
  const textWidth = ctx.measureText(text).width;
  const x = (width - textWidth) / 2;
  const y = height / 2 + 20;

  ctx.fillText(text, x, y);

  return canvas.toBuffer("image/png");
}
