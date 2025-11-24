import express from "express";
import { middleware, Client } from "@line/bot-sdk";
import { handleMessage } from "./service/messageReply.js";

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new Client(config);

app.post("/webhook", middleware(config), async (req, res) => {
  const events = req.body.events;

  await Promise.all(
    events.map(async (event) => {
      if (event.type === "message" && event.message.type === "text") {
        const buffer = await handleMessage(event.message.text);

        const base64 = buffer.toString("base64");
        const dataUrl = `data:image/png;base64,${base64}`;

        return client.replyMessage(event.replyToken, {
          type: "image",
          originalContentUrl: dataUrl,
          previewImageUrl: dataUrl,
        });
      }
    })
  );

  res.status(200).end();
});

app.listen(3000, () => {
  console.log("BOT running on 3000");
});
