import { Telegraf } from "telegraf";

export const bot = new Telegraf(
  "8085957702:AAFxAul93965m0ymrdwbUyNbqOkWnCtFOjk"
);

bot.start((ctx) => {
  ctx.reply(
    "👋 Привет! Добро пожаловать в ФМЛ x10 2026!\n\n" +
      "Нажмите <b>Регистрация</b> или используйте другие команды бота.",
    {
      parse_mode: "HTML",
    }
  );
});
