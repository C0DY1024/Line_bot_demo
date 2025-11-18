require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("@line/bot-sdk");

const app = express();

// 先確認環境變數是否有讀到
console.log("CHANNEL_ACCESS_TOKEN:", process.env.CHANNEL_ACCESS_TOKEN ? "有讀到" : "未讀到");
console.log("CHANNEL_SECRET:", process.env.CHANNEL_SECRET ? "有讀到" : "未讀到");

if (!process.env.CHANNEL_ACCESS_TOKEN || !process.env.CHANNEL_SECRET) {
  console.error("環境變數缺失！請確認 Render 上 CHANNEL_ACCESS_TOKEN 和 CHANNEL_SECRET 已設定，且不要加引號。");
  process.exit(1); // 停止程式，避免 client 未定義
}

// LINE Bot 設定
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);

app.use(bodyParser.json());

// 測試首頁
app.get("/", (req, res) => {
  res.send("LINE Bot is running!");
});

// Webhook endpoint
app.post("/webhook", (req, res) => {
  const events = req.body.events || [];

  // 印出收到的完整事件，用來 debug
  console.log("收到事件:", JSON.stringify(events, null, 2));

  Promise.all(
    events.map((event) => {
      if (event.type === "message" && event.message.type === "text") {
        console.log("收到文字訊息:", event.message.text);
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: `你剛剛說：${event.message.text}`,
        });
      } else {
        console.log("收到其他事件:", event.type);
      }
    })
  )
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error("回覆訊息失敗:", err);
      res.sendStatus(500);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
