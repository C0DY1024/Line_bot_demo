import express from "express";
import * as line from "@line/bot-sdk";
import { handleUserMessage } from "./service/messageReply.js";

const app = express();

// LINE 設定
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

app.post("/webhook", line.middleware(config), async (req, res) => {
  const events = req.body.events;

  const client = new line.Client(config);

  const results = events.map(async (event) => {
    if (event.type === "message" && event.message.type === "text") {
      const userText = event.message.text;
      const replyText = handleUserMessage(userText);

      return client.replyMessage(event.replyToken, {
        type: "text",
        text: replyText,
      });
    }
  });

  await Promise.all(results);
  res.status(200).end();
});

app.listen(3000, () => console.log("Bot running"));
