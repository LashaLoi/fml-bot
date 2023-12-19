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
  .command("schedule", (ctx) =>
    ctx.reply(
      "Выберите день",
      Markup.keyboard([["2 февраля, пт", "3 февраля, сб"]])
    )
  )
  .hears("2 февраля, пт", async (ctx) => {
    await ctx.reply("Расписание на 2 февраля, пт", Markup.removeKeyboard());
    ctx.reply(
      `<b>10:00</b> - регистрация, расселение
<b>11:25</b> - обратный отсчет
<b>11:30</b> - Сессия 1
<b>13:30</b> - обед
<b>14:30</b> - семинары:
<b>14:35</b> - extra talk
<b>15:00</b> - семинар
<b>15:35</b> - extra talk
<b>16:00</b> - семинар
<b>16:30</b> - кофе-пауза
<b>17:00</b> - topic talks
<b>18:00</b> - ужин
<b>19:00</b> - worship party`,
      {
        parse_mode: "HTML",
      }
    );
  })
  .hears("3 февраля, сб", async (ctx) => {
    await ctx.reply("Расписание на 3 февраля, сб", Markup.removeKeyboard());
    await ctx.reply(
      `8:00 - молитва
<b>9:00</b> - завтрак
<b>10:00</b> - Cессия 2
<b>11:30</b> - кофе-пауза
<b>12:00</b> - extra talk
<b>12:30</b> - семинар
<b>13:00</b> - extra talk
<b>13:30</b> - обед
<b>14:30</b> - topic talks:
<b>15:30</b> - кофе-пауза
<b>16:00</b> - Сессия 3
<b>17:30</b> - блок свидетельств
<b>18:00</b> - время на анкету (обратная связь)
<b>18:30</b> - ужин
<b>19:30</b> - отъезд`,
      {
        parse_mode: "HTML",
      }
    );
  })
  .command("help", (ctx) =>
    ctx.reply("Все еще есть вопросы? Напиши нам - fml@ywam.by")
  )
  .command("registration", (ctx) =>
    ctx.reply(
      "Регистрация ФМЛ / EXTRA",
      Markup.keyboard([["Начать регистарцию?", "Выйти"]])
    )
  )
  .hears("Начать регистарцию?", (ctx) => {
    setState(ctx.chat.id, {
      registrationStarted: true,
      state: "NAME",
    });

    ctx.reply("1) Введите ваше ФИО", Markup.removeKeyboard());
  })
  .hears("Выйти", (ctx) => {
    ctx.reply("✅ Выход выполнен", Markup.removeKeyboard());
  })
  .hears("Попробую позже", (ctx) =>
    ctx.reply(
      "Если не получается зарегестрироваться, напишите https://t.me/SideswipeLoi",
      Markup.removeKeyboard()
    )
  )
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
          "2) Выберите дни?",
          Markup.keyboard([["2 Февраля", "3 Февраля"], ["Оба дня"]])
        );
        break;
      case "DAYS":
        setState(chatId, {
          state: "CITY",
          days: message,
        });

        ctx.reply("3) Из какого вы города?", Markup.removeKeyboard());
        break;
      case "CITY":
        setState(chatId, {
          state: "CHURCH",
          city: message,
        });

        ctx.reply("4) Из какого вы церкви?");
        break;
      case "CHURCH":
        setState(chatId, {
          state: "PASTOR",
          church: message,
        });

        ctx.reply("5) Укажите ФИО пастора");
        break;
      case "PASTOR":
        setState(chatId, {
          state: "MINISTRY",
          pastor: message,
        });

        ctx.reply("6) Укажите вашу ответственность в церкви");
        break;
      case "MINISTRY":
        setState(chatId, {
          state: "EXPECT",
          ministry: message,
        });

        ctx.reply("7) Напишите ваши ожидания");
        break;
      case "EXPECT":
        setState(chatId, {
          state: "TRANSPORT",
          expect: message,
        });

        ctx.reply(
          "8) Нужна ли вам помощь с транспортом?",
          Markup.keyboard([["Да", "Нет"]])
        );
        break;
      case "TRANSPORT":
        setState(chatId, {
          state: "AGE",
          transport: message,
        });

        ctx.reply(
          "9) Укажите вашу дату рождения (14/10/1998)",
          Markup.removeKeyboard()
        );
        break;
      case "AGE":
        setState(chatId, {
          state: "CHILDREN",
          age: message,
        });

        ctx.reply(
          "10) Дети, которые поедут с вами на ФМЛ (ФИО, возраст). Если нет детей, просто введите `-`"
        );
        break;
      case "CHILDREN":
        setState(chatId, {
          state: "PHONE",
          children: message,
        });

        ctx.reply("11) Ваш телефон. Пример: +375 (29/33) 123 45 67");
        break;
      case "PHONE":
        setState(chatId, {
          state: "Q",
          phone: message,
        });

        ctx.reply("12) Есть ли у вас вопросы? Если нет, просто введите `-`");
        break;
      case "Q":
        setState(chatId, {
          state: "EMAIL",
          q: message,
        });

        ctx.reply("13) Ваш Email");
        break;
      case "EMAIL":
        setState(chatId, {
          state: "END",
          email: message,
        });

        ctx.reply("14) Есть ли у вас аллергия? (так же о детях)");
        break;
      case "END":
        setState(chatId, {
          state: null,
          registrationStarted: false,
          alergy: message,
        });

        const { first_name, last_name, username } = ctx.update.message.from;
        const state = getState(chatId);

        axios
          .post(
            "https://script.google.com/macros/s/AKfycby0BcWVC7xR7DcJGzMNPT6GlVbBlXsf7llnl1ntYRJgp5eJ1DNepELamphGhzqIUWkS/exec",
            {
              ...state,
              telegram: username ?? "-",
              registeredBy: `${first_name ?? "-"} ${last_name ?? "-"}`,
              chatId: ctx.update.message.chat.id,
              date: Date.now(),
              id: ctx.update.message.from.id,
            }
          )
          .then(() => {
            ctx.reply(
              "✅ Спасибо, что вы ответили на все вопросы. Для окончательного завершения регистрации вам необходимо внести пожертвования в размере 140 руб (до 20.01) или 150 руб (с 21.01)",
              Markup.removeKeyboard()
            );
            deleteState(chatId);
          })
          .catch(() => {
            ctx.reply(
              "❌ Что-то пошло не так, попробуйте позже 😣\nПопробовать снова?",
              Markup.keyboard([["Да", "Попробую позже"]])
            );

            setState(chatId, {
              state: "END",
              registrationStarted: true,
            });
          });

        break;
    }
  });
