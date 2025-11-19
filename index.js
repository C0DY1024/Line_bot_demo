import express from "express";
import dotenv from "dotenv";
import { Client, middleware } from "@line/bot-sdk";

dotenv.config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

console.log("Loaded config:", config);

const app = express();

// ★ 正式建立 client（關鍵）
const client = new Client(config);

app.post("/webhook", middleware(config), (req, res) => {
  console.log("收到事件:", req.body);

  Promise.all(req.body.events.map(async (event) => {
    if (event.type === "message" && event.message.type === "text") {
      console.log("使用者傳來：", event.message.text);

      return client.replyMessage(event.replyToken, {
        type: "text",
        text: `你說：${event.message.text}`,
      });
    }
  }))
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error("處理事件時出錯：", err);
      res.status(500).end();
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
