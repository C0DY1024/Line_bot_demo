import express from "express";
import dotenv from "dotenv";
import { middleware, Client } from "@line/bot-sdk";
import { handleUserMessage } from "./service/messageReply.js";

dotenv.config();

const app = express();

// LINE 設定
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// 記憶體圖片快取
const imageCache = new Map();

// serve 圖片
app.get("/img/:id", (req, res) => {
  const id = req.params.id;
  const item = imageCache.get(id);

  if (!item) {
    return res.status(404).send("Image not found");
  }

  res.set("Content-Type", "image/png");
  res.send(item.buffer);
});

// Webhook
app.post("/webhook", middleware(config), async (req, res) => {
  const client = new Client(config);
  const events = req.body.events;

  const results = events.map(async (event) => {
    if (event.type === "message" && event.message.type === "text") {
      const userText = event.message.text;

      const reply = await handleUserMessage(userText);

      // 純文字回覆
      if (reply.type === "text") {
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: reply.text,
        });
      }

      // 圖片回覆
      if (reply.type === "image") {
        const id = Math.random().toString(36).slice(2);
        imageCache.set(id, reply); // 儲存 buffer

        const imageUrl = `${process.env.BASE_URL}/img/${id}`;

        return client.replyMessage(event.replyToken, {
          type: "image",
          originalContentUrl: imageUrl,
          previewImageUrl: imageUrl,
        });
      }
    }
  });

  await Promise.all(results);
  res.status(200).end();
});

// 啟動服務
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Bot running on port ${port}`));
