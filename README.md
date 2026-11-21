# rubika-cf

کتابخانه‌ای سبک و مدرن برای ساخت ربات‌های روبیکا با TypeScript و Cloudflare Workers. بدون وابستگی اضافی، با پشتیبانی از Webhook، دستورات، دکمه‌ها و میدلورها.

<p align="center">

**TypeScript · Zero Dependencies · Cloudflare Workers · Webhook**

</p>

## معرفی

`rubika-cf` یک کتابخانه TypeScript برای ساخت ربات‌های روبیکا است که با تمرکز بر سادگی، سرعت و سازگاری با Cloudflare Workers طراحی شده است.

با استفاده از این کتابخانه می‌توانید ربات‌های خود را بدون نیاز به سرور اختصاصی و با استفاده از Webhook اجرا کنید.

### ویژگی‌ها

- پشتیبانی کامل از TypeScript
- بدون وابستگی اضافی در زمان اجرا
- پشتیبانی از Cloudflare Workers، Bun و Node.js 18+
- مدیریت دستورات و پیام‌های متنی
- پشتیبانی از دکمه‌های اینلاین و کیبورد
- سیستم میدلور برای مدیریت درخواست‌ها
- مدیریت خطاها
- پشتیبانی از Webhook
- دسترسی به متدهای Rubika Bot API
- قابلیت ساخت ربات‌های چندمنظوره

## پیش‌نیازها

برای استفاده از کتابخانه به موارد زیر نیاز دارید:

- Node.js نسخه 18 یا بالاتر، Bun یا Cloudflare Workers
- TypeScript نسخه 5 یا بالاتر (در صورت استفاده از TypeScript)
- توکن ربات روبیکا
- حساب Cloudflare برای استقرار ربات روی Workers

## نصب

با استفاده از یکی از package managerهای زیر، کتابخانه را نصب کنید:

```bash
npm install rubika-cf
```

یا با Yarn:

```bash
yarn add rubika-cf
```

یا با Bun:

```bash
bun add rubika-cf
```

## ساخت اولین ربات

در این مثال یک ربات ساده ایجاد می‌کنیم که به دستور `/start` پاسخ می‌دهد و پیام‌های دریافتی را تکرار می‌کند.

```ts
import { Bot } from "rubika-cf";

const bot = new Bot(process.env.BOT_TOKEN!);

bot.command("start", async (ctx) => {
  await ctx.reply("سلام! به ربات خوش آمدید.");
});

bot.command("echo", async (ctx) => {
  await ctx.reply(ctx.args.join(" ") || "پیامی برای تکرار ارسال کنید.");
});

bot.hears("سلام", async (ctx) => {
  await ctx.reply("سلام، خوش آمدید!");
});
```

## دستورات

با استفاده از `bot.command()` می‌توانید دستورات مختلفی برای ربات تعریف کنید.

```ts
bot.command("start", async (ctx) => {
  await ctx.reply("ربات فعال است.");
});

bot.command(["help", "about"], async (ctx) => {
  await ctx.reply("راهنمای ربات");
});
```

امکان دریافت آرگومان‌های دستور نیز وجود دارد:

```ts
bot.command("echo", async (ctx) => {
  await ctx.reply(ctx.args.join(" "));
});
```

## دریافت پیام‌ها

با استفاده از `bot.hears()` می‌توانید پیام‌های متنی مشخص یا الگوهای دلخواه را بررسی کنید.

```ts
bot.hears("ping", async (ctx) => {
  await ctx.reply("pong");
});
```

همچنین می‌توانید از عبارات منظم استفاده کنید:

```ts
bot.hears(/^سلام (.+)$/, async (ctx) => {
  await ctx.reply(`سلام ${ctx.match![1]}`);
});
```

## دکمه‌های اینلاین

برای ساخت دکمه‌های اینلاین می‌توانید از `keypad()` استفاده کنید.

```ts
import { keypad } from "rubika-cf";

const kb = keypad([
  [
    ["help", "راهنما"],
    ["about", "درباره ما"],
  ],
]);

bot.command("menu", async (ctx) => {
  await ctx.reply("یک گزینه انتخاب کنید:", {
    inline_keypad: kb,
  });
});
```

برای مدیریت کلیک روی دکمه‌ها از `bot.action()` استفاده کنید:

```ts
bot.action("help", async (ctx) => {
  await ctx.reply("راهنمای ربات");
});

bot.action("about", async (ctx) => {
  await ctx.reply("این ربات با rubika-cf ساخته شده است.");
});
```

## کیبورد و دکمه‌ها

با `KeypadBuilder` می‌توانید کیبوردهای خود را به‌صورت ساده و انعطاف‌پذیر ایجاد کنید.

```ts
import { KeypadBuilder, button } from "rubika-cf";

const keyboard = new KeypadBuilder()
  .row(button("yes", "بله"), button("no", "خیر"))
  .button("later", "بعداً")
  .resized(true)
  .build();
```

## میدلورها

میدلورها به شما امکان می‌دهند قبل یا بعد از اجرای دستورات، عملیات دلخواهی انجام دهید؛ مانند بررسی دسترسی کاربران، ثبت اطلاعات یا مدیریت درخواست‌ها.

```ts
bot.use(async (ctx, next) => {
  console.log("درخواست جدید دریافت شد");

  await next();
});
```

## مدیریت رویدادها

با استفاده از `bot.on()` می‌توانید رویدادهای مختلف ربات را مدیریت کنید.

```ts
bot.on("started", async (ctx) => {
  await ctx.reply("خوش آمدید!");
});

bot.on("stopped", async (ctx) => {
  console.log("کاربر ربات را متوقف کرد.");
});

bot.on("update", async (ctx) => {
  console.log("رویداد جدید:", ctx.type);
});
```

## ارسال و مدیریت پیام‌ها

از طریق Context می‌توانید به امکانات مختلفی دسترسی داشته باشید:

```ts
await ctx.reply("سلام");

await ctx.replyWithFile("file_id", {
  text: "فایل ارسال شد",
});

await ctx.deleteMessage(ctx.messageId);

await ctx.forwardMessage(ctx.messageId, "target_chat_id");
```

همچنین امکان ویرایش پیام و کیبورد وجود دارد:

```ts
await ctx.editText(ctx.messageId, "متن جدید");

await ctx.editKeypad(ctx.messageId, keyboard);
```

## دسترسی به API روبیکا

برای استفاده مستقیم از متدهای API روبیکا، می‌توانید از `bot.api` استفاده کنید.

```ts
const api = bot.api;

const me = await api.getMe();

await api.sendMessage({
  chat_id: "chat_id",
  text: "سلام!",
});
```

این بخش دسترسی به امکانات مختلف Bot API از جمله ارسال پیام، مدیریت اعضا، دریافت اطلاعات چت، ارسال فایل و موارد دیگر را فراهم می‌کند.

## مدیریت خطاها

برای مدیریت خطاهای ربات می‌توانید از `bot.catch()` استفاده کنید.

```ts
bot.catch(async (err, ctx) => {
  console.error("خطای ربات:", err);

  await ctx.reply("خطایی رخ داد. لطفاً دوباره تلاش کنید.").catch(() => {});
});
```

## راه‌اندازی روی Cloudflare Workers

یکی از کاربردهای اصلی `rubika-cf` اجرای ربات روی Cloudflare Workers است.

در این روش، ربات با استفاده از Webhook به‌روزرسانی‌ها را دریافت می‌کند و نیازی به اجرای مداوم سرور یا Polling ندارد.

### نمونه فایل Worker

```ts
import { Bot } from "rubika-cf";

interface Env {
  BOT_TOKEN: string;
  WEBHOOK_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const bot = new Bot(env.BOT_TOKEN);

    bot.command("start", async (ctx) => {
      await ctx.reply("ربات با موفقیت فعال شد.");
    });

    const handler = bot.webhook({
      secret: env.WEBHOOK_SECRET,
    });

    return handler(request, ctx);
  },
};
```

### تنظیم Webhook

پس از استقرار Worker، آدرس آن را به ربات معرفی کنید:

```ts
import { Bot } from "rubika-cf";

const bot = new Bot(process.env.BOT_TOKEN!);

await bot.setWebhook(
  `https://your-worker.workers.dev/${process.env.WEBHOOK_SECRET}`,
);
```

با ثبت Webhook، ربات به‌صورت خودکار به‌روزرسانی‌های روبیکا را دریافت می‌کند.

## ساختار پیشنهادی پروژه

```text
my-bot/
├── worker.ts
├── wrangler.toml
├── src/
│   ├── bot.ts
│   ├── handlers/
│   │   ├── start.ts
│   │   └── help.ts
│   ├── middleware/
│   │   └── admin.ts
│   └── utils/
│       └── keyboards.ts
└── package.json
```

---

<p align="center">
ساخته شده با ❤️ توسط هادی رستمی برای توسعه‌دهندگان روبیکا
</p>
