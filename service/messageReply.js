// service/messageReply.js

export function handleUserMessage(text) {
  text = text.trim();

  if (text === "你好") {
    return "你也你好";
  }

  if (text.includes("天氣")) {
    return "天氣？你自己看窗外比較準。";
  }

  return `你說：${text}`;
}
