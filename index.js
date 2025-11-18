require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("@line/bot-sdk");

const app = express();




app.use(bodyParser.json());

// webhook endpoint
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
  ).then(() => res.end());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
