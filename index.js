import express from "express";

import { Telegraf } from "telegraf";

const app = express();

const bot = new Telegraf("6500336866:AAEAmq7dc8zGfqCwY7SVt98pvWDna0y7AnA");

bot.start((ctx) => ctx.reply("Hello, world!"));

bot.command("registration", (ctx) => ctx.reply("Регистрация"));

app
  .get("/", (_req, res) => res.json({ bot: "started" }))
  .listen(3000, () => {
    console.log("server started!");

    bot.launch();
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
