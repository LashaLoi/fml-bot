import { Telegraf } from "telegraf";

export const bot = new Telegraf(
  "6500336866:AAEAmq7dc8zGfqCwY7SVt98pvWDna0y7AnA"
);

bot.start((ctx) => {
  ctx.reply("Добро пожаловать!");
});
