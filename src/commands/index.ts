import { Markup } from "telegraf";
import axios from "axios";

import { getState, setState, deleteState } from "../state";
import { bot } from "../bot";

bot
  .command("site", (ctx) => {
    ctx.reply("Наш сайт: https://fml.ywam.by/");
  })
  .command("location", async (ctx) => {
    await ctx.reply("Локация: Санаторий Спутник");
    ctx.sendLocation(53.96071014707217, 27.416530229487815);
  })
  .command("schedule", (ctx) => ctx.reply("расписание"))
  .command("help", (ctx) =>
    ctx.reply("Все еще есть вопросы?\nНапиши нам - fml@ywam.by")
  )
  .command("registration", (ctx) =>
    ctx.reply(
      "Регистрация начата",
      Markup.keyboard(["Начать регистарцию?", "Выйти"])
    )
  )
  .hears("Начать регистарцию?", (ctx) => {
    setState(ctx.chat.id, {
      registrationStarted: true,
      state: "NAME",
    });

    ctx.reply("1️⃣ Введите ваше ФИО", Markup.removeKeyboard());
  })
  .hears("Выйти", (ctx) => {
    ctx.reply("Выход выполнен", Markup.removeKeyboard());
  })
  .on("message", (ctx) => {
    const chatId = ctx.chat.id;
    const message = (ctx.update.message as { text: string }).text;

    const data = getState(chatId);

    if (!data) return;

    switch (data.state) {
      case "NAME":
        setState(chatId, {
          state: "DAYS",
          full_name: message,
        });

        ctx.reply(
          "2️⃣ Выберите дни?",
          Markup.keyboard(["2 Февраля", "3 Февраля", "Оба дня"])
        );
        break;
      case "DAYS":
        setState(chatId, {
          state: "CITY",
          days: message,
        });

        ctx.reply("3️⃣ Из какого вы города?", Markup.removeKeyboard());
        break;
      case "CITY":
        setState(chatId, {
          state: "CHURCH",
          city: message,
        });

        ctx.reply("4️⃣ Из какого вы церкви?");
        break;
      case "CHURCH":
        setState(chatId, {
          state: "PASTOR",
          church: message,
        });

        ctx.reply("5️⃣ Укажите ФИО пастора");
        break;
      case "PASTOR":
        setState(chatId, {
          state: "MINISTRY",
          pastor: message,
        });

        ctx.reply("6️⃣ Укажите вашу ответственность в церкви");
        break;
      case "MINISTRY":
        setState(chatId, {
          state: "EXPECT",
          ministry: message,
        });

        ctx.reply("7️⃣ Напишите ваши ожидания");
        break;
      case "EXPECT":
        setState(chatId, {
          state: "TRANSPORT",
          expect: message,
        });

        ctx.reply(
          "8️⃣ Нужна ли вам помощь с транспортом?",
          Markup.keyboard(["Да", "Нет"])
        );
        break;
      case "TRANSPORT":
        setState(chatId, {
          state: "AGE",
          transport: message,
        });

        ctx.reply(
          "9️⃣ Укажите вашу дату рождения (14/10/1998)",
          Markup.removeKeyboard()
        );
        break;
      case "AGE":
        setState(chatId, {
          state: "CHILDREN",
          age: message,
        });

        ctx.reply(
          "🔟 Дети, которые поедут с вами на ФМЛ (ФИО, возраст).\nЕсли нет детей, просто введите `-`"
        );
        break;
      case "CHILDREN":
        setState(chatId, {
          state: "PHONE",
          children: message,
        });

        ctx.reply("1️⃣1️⃣ Ваш телефон.\nПример: +375 (29/33) 123 45 67");
        break;
      case "PHONE":
        setState(chatId, {
          state: "EMAIL",
          phone: message,
        });

        ctx.reply(
          "1️⃣2️⃣ Есть ли у вас вопросы?\nВведите `-` если нет никаких вопросов"
        );
        break;
      case "EMAIL":
        setState(chatId, {
          state: "END",
          email: message,
        });

        ctx.reply("1️⃣3️⃣ Ваш e-mail");
        break;
      case "END":
        setState(chatId, {
          state: null,
          registrationStarted: false,
          email: message,
        });

        axios
          .post(
            "https://script.google.com/macros/s/AKfycby0BcWVC7xR7DcJGzMNPT6GlVbBlXsf7llnl1ntYRJgp5eJ1DNepELamphGhzqIUWkS/exec",
            {
              ...getState(chatId),
              telegram: ctx.update.message.from.username ?? "-",
              registeredBy:
                ctx.update.message.from.first_name ??
                "-" + " " + ctx.update.message.from.last_name ??
                "-",
            }
          )
          .then(() => ctx.reply("Регистрация прошла успешно! 👍"))
          .catch(() => ctx.reply("Что-то пошло не так, попробуйте позже 😣"));

        deleteState(chatId);
        break;
    }
  });
