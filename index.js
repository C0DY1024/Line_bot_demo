// 載入環境變數
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("@line/bot-sdk");

const app = express();

// LINE Bot 設定
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// 先確認環境變數有值
if (!config.channelAccessToken || !config.channelSecret) {
  console.error("請確認 CHANNEL_ACCESS_TOKEN 和 CHANNEL_SECRET 已設定在環境變數！");
  process.exit(1);
}

// 建立 client
const client = new Client(config);

app.use(bodyParser.json());

// 簡單測試首頁
app.get("/", (req, res) => {
  res.send("LINE Bot is running!");
});

// Webhook endpoint
app.post("/webhook", (req, res) => {
  const events = req.body.events || [];
  Promise.all(
    events.map((event) => {
      if (event.type === "message" && event.message.type === "text") {
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: `你剛剛說：${event.message.text}`,
        });
      }
      // 其他事件可以加 else if 處理
    })
  )
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// Render 會自動提供 PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
