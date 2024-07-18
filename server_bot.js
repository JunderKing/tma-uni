const { Bot } = require('grammy')

// const bot = new Bot('7017202559:AAFIdFaZQAprDnPFlbXvs0UW9STqJA5GAPU');
const bot = new Bot('7293950505:AAExuq1OFmJsUQ2tM8gi18BArrqWjhtNBsI');

const paidUsers = new Map();

// 开始
bot.command("start", (ctx) =>
  ctx.reply(`Welcome! I am a simple bot that can accept payments via Telegram Stars. The following commands are available:
    /pay - to pay
    /status - to check payment status
    /refund - to refund payment`,
  ),
);

// 支付
bot.command("pay", (ctx) => {
  return ctx.replyWithInvoice("Test Product", "Test description", "{}", "XTR", [
    { amount: 1, label: "Test Product" },
  ]);
});

// 支付前确认
bot.on("pre_checkout_query", (ctx) => {
  console.log('pre_checkout_query')
  return ctx.answerPreCheckoutQuery(true).catch(() => {
    console.error("answerPreCheckoutQuery failed");
  });
});

// 支付成功
bot.on("message:successful_payment", (ctx) => {
  console.log('message:successful_payment')
  if (!ctx.message || !ctx.message.successful_payment || !ctx.from) {
    return;
  }

  paidUsers.set(
    ctx.from.id,
    ctx.message.successful_payment.telegram_payment_charge_id,
  );

  console.log(ctx.message.successful_payment);
});

// 查询状态
bot.command("status", (ctx) => {
  const message = paidUsers.has(ctx.from.id)
    ? "You have paid"
    : "You have not paid yet";
  return ctx.reply(message);
});

// 退款
bot.command("refund", (ctx) => {
  const userId = ctx.from.id;
  if (!paidUsers.has(userId)) {
    return ctx.reply("You have not paid yet, there is nothing to refund");
  }

  ctx.api
    .refundStarPayment(userId, paidUsers.get(userId))
    .then(() => {
      paidUsers.delete(userId);
      return ctx.reply("Refund successful");
    })
    .catch(() => ctx.reply("Refund failed"));
});

bot.start();
