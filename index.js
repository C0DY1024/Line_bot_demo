const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("@line/bot-sdk");
require("dotenv").config();

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("LINE Bot is running!");
});

// Webhook endpoint
app.post("/webhook", (req, res) => {
  const events = req.body.events;
  Promise.all(
    events.map((event) => {
      if (event.type === "message" && event.message.type === "text") {
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: `你剛剛說：${event.message.text}`,
        });
      }
    })
  ).then(() => res.sendStatus(200));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
