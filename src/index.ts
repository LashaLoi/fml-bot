import express from "express";

import { bot } from "./bot";
import "./commands";

const app = express();

app
  .get("/", (_req, res) => res.json({ server: "running" }))
  .get("/down", (_req, res) => {
    bot.stop("Down bot");

    return res.json({ bot: "down" });
  })
  .listen(3000, () => {
    console.log("express server started!");

    bot.launch();
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
