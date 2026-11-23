# rubika-cf

کتابخانه‌ای سبک و مدرن برای ساخت ربات‌های روبیکا با TypeScript و Cloudflare Workers. بدون وابستگی اضافی، با پشتیبانی از Webhook، دستورات، دکمه‌ها و میدلورها.

<p align="center">

**TypeScript · Zero Dependencies · Cloudflare Workers · Webhook**

</p>

<p align="center"> 
<a href="https://www.npmjs.com/package/rubika-cf"><img src="https://img.shields.io/npm/v/rubika-cf.svg?style=flat-square" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/rubika-cf"><img src="https://img.shields.io/npm/dt/rubika-cf.svg?style=flat-square" alt="NPM Downloads" /></a>
<a href="https://github.com/hadi-rostami/rubika-cf/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/rubika-cf.svg" alt="license" /></a>
</p>

## فهرست

- معرفی
- ویژگی‌ها
- پیش‌نیازها
- نصب
- شروع سریع
- راه‌اندازی روی Cloudflare Workers
  - نصب Wrangler
  - اتصال به حساب Cloudflare
  - ساخت پروژه
  - فایل `wrangler.toml`
  - نوشتن Worker
  - تنظیم Secretها
  - اجرای محلی
  - استقرار روی Cloudflare
  - تنظیم Webhook
  - مشاهده لاگ‌ها
- دستورات
- دریافت پیام‌ها
- دکمه‌های اینلاین
- کیبورد و دکمه‌ها
- میدلورها
- مدیریت رویدادها
- ارسال و مدیریت پیام‌ها
- دسترسی مستقیم به API روبیکا
- مدیریت خطاها
- ساختار پیشنهادی پروژه
- عیب‌یابی
- مجوز

## معرفی

`rubika-cf` یک کتابخانه TypeScript برای ساخت ربات‌های روبیکا است که با تمرکز بر سادگی، سرعت و سازگاری با Cloudflare Workers طراحی شده است.

آپدیت‌ها از طریق **Webhook** دریافت می‌شوند؛ روبیکا هر آپدیت را به آدرس Worker شما POST می‌کند.

## ویژگی‌ها

- پشتیبانی کامل از TypeScript
- بدون وابستگی اضافی در زمان اجرا
- پشتیبانی از Cloudflare Workers، Bun و Node.js 18+
- دریافت آپدیت‌ها با **Webhook**
- مدیریت دستورات و پیام‌های متنی
- پشتیبانی از دکمه‌های اینلاین و کیبورد
- سیستم میدلور برای مدیریت درخواست‌ها
- مدیریت خطاها
- دسترسی به متدهای Rubika Bot API
- قابلیت ساخت ربات‌های چندمنظوره

## پیش‌نیازها

- Node.js نسخه 18 یا بالاتر، Bun یا Cloudflare Workers
- TypeScript نسخه 5 یا بالاتر (در صورت استفاده از TypeScript)
- توکن ربات روبیکا
- حساب Cloudflare برای استقرار روی Workers

## نصب

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

## شروع سریع

یک ربات ساده که به دستور `/start` پاسخ می‌دهد و پیام‌ها را تکرار می‌کند:

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

حالا کافی است ربات را روی Cloudflare Workers مستقر کنید و Webhook را تنظیم کنید. ادامه کار در بخش **راه‌اندازی روی Cloudflare Workers** آمده است.

---

## راه‌اندازی روی Cloudflare Workers

این بخش قدم‌به‌قدم از نصب Wrangler تا اتصال به Cloudflare و دریافت آپدیت‌ها با Webhook را توضیح می‌دهد.

### ۱. نصب Wrangler

[Wrangler](https://developers.cloudflare.com/workers/wrangler/) ابزار رسمی Cloudflare برای ساخت و استقرار Worker است.

نصب به‌صورت وابستگی پروژه (پیشنهادی):

```bash
npm install --save-dev wrangler
```

یا نصب سراسری:

```bash
npm install -g wrangler
```

بررسی نصب:

```bash
npx wrangler --version
```

> اگر Wrangler را سراسری نصب کرده‌اید، در دستورهای بعدی می‌توانید `npx wrangler` را با `wrangler` جایگزین کنید.

### ۲. اتصال به حساب Cloudflare

```bash
npx wrangler login
```

این دستور مرورگر را باز می‌کند و از شما می‌خواهد دسترسی Wrangler به حساب Cloudflare را تأیید کنید. پس از تأیید، اطلاعات ورود روی سیستم شما ذخیره می‌شود.

بررسی حساب متصل:

```bash
npx wrangler whoami
```

اگر در محیط بدون مرورگر (مثل CI یا سرور) هستید، به‌جای Login از API Token استفاده کنید:

```bash
# Linux / macOS
export CLOUDFLARE_API_TOKEN="your-api-token"
```

```powershell
# Windows PowerShell
$env:CLOUDFLARE_API_TOKEN="your-api-token"
```

برای ساخت API Token به داشبورد Cloudflare مراجعه کنید: **My Profile → API Tokens → Create Token** و دسترسی **Edit Cloudflare Workers** را انتخاب کنید.

### ۳. ساخت پروژه

یک پوشه برای ربات بسازید:

```bash
mkdir my-rubika-bot
cd my-rubika-bot
npm init -y
npm install rubika-cf
npm install --save-dev wrangler typescript @cloudflare/workers-types
```

سپس دو فایل `worker.ts` و `wrangler.toml` را در ریشه پروژه ایجاد کنید.

### ۴. فایل `wrangler.toml`

```toml
name = "my-rubika-bot"
main = "worker.ts"
compatibility_date = "2026-11-01"

[observability.logs]
enabled = true
invocation_logs = true
```

اگر می‌خواهید از KV استفاده کنید (مثلاً برای ذخیره وضعیت کاربران)، ابتدا Namespace بسازید:

```bash
npx wrangler kv namespace create KV
```

خروجی شامل یک `id` است. آن را در `wrangler.toml` اضافه کنید:

```toml
[[kv_namespaces]]
binding = "KV"
id = "شناسه‌ای-که-چاپ-شد"
```

> نام `binding` همان نامی است که در کد Worker با `env.KV` به آن دسترسی خواهید داشت.

### ۵. نوشتن Worker

```ts
import { Bot } from "rubika-cf";

interface Env {
  BOT_TOKEN: string;
  WEBHOOK_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // یک مسیر ساده برای بررسی سلامت Worker
    if (new URL(request.url).pathname === "/") {
      return new Response("rubika-cf bot is running");
    }

    const bot = new Bot(env.BOT_TOKEN);

    bot.command("start", async (c) => {
      await c.reply("ربات با موفقیت فعال شد.");
    });

    bot.command("help", async (c) => {
      await c.reply("دستورهای موجود:\n/start\n/help");
    });

    // هندلر Webhook؛ فقط درخواست‌های POST با مسیر /<WEBHOOK_SECRET> را می‌پذیرد
    return bot.webhook({
      secret: env.WEBHOOK_SECRET,
    })(request, ctx);
  },
};
```

> `bot.webhook()` مسیر درخواست را با `/<WEBHOOK_SECRET>` مقایسه می‌کند. اگر مسیر یا متد درست نباشد، پاسخ `404` برگردانده می‌شود. بنابراین آدرس Webhook باید شامل همین Secret باشد.

### ۶. تنظیم Secretها

توکن ربات و Secret مربوط به Webhook را در Cloudflare ذخیره کنید:

```bash
npx wrangler secret put BOT_TOKEN
npx wrangler secret put WEBHOOK_SECRET
```

هر دستور از شما مقدار را می‌پرسد. این مقادیر رمزنگاری‌شده و فقط در زمان اجرا در `env` در دسترس هستند.

برای اجرای محلی، یک فایل `.dev.vars` در ریشه پروژه بسازید:

```dotenv
BOT_TOKEN=توکن-ربات-شما
WEBHOOK_SECRET=یک-رشته-تصادفی-و-طولانی
```

> فایل `.dev.vars` را در `.gitignore` قرار دهید تا هرگز در Git ذخیره نشود.

برای ساخت یک Secret تصادفی:

```bash
# Linux / macOS
openssl rand -hex 32
```

```powershell
# Windows PowerShell
-join ((1..32) | ForEach-Object { "{0:x2}" -f (Get-Random -Max 256) })
```

### ۷. اجرای محلی

```bash
npx wrangler dev
```

Worker به‌صورت پیش‌فرض روی `http://localhost:8787` اجرا می‌شود. چون روبیکا برای Webhook به آدرس عمومی HTTPS نیاز دارد، برای تست واقعی یک تونل عمومی (مثل `cloudflared tunnel`) بسازید.

> برای اجرا روی محیط واقعی Cloudflare از `npx wrangler dev --remote` استفاده کنید.

### ۸. استقرار روی Cloudflare

```bash
npx wrangler deploy
```

پس از پایان، Wrangler آدرس Worker را چاپ می‌کند؛ چیزی شبیه این:

```text
https://my-rubika-bot.<your-subdomain>.workers.dev
```

### ۹. تنظیم Webhook

آدرس Worker را به ربات معرفی کنید. یک فایل `scripts/set-webhook.ts` بسازید:

```ts
import { Bot } from "rubika-cf";

const token = process.env.BOT_TOKEN;
const url = process.env.WEBHOOK_URL;

if (!token) throw new Error("BOT_TOKEN is required");
if (!url) throw new Error("WEBHOOK_URL is required");

const bot = new Bot(token);
await bot.setWebhook(url);

console.log("Webhook set:", url);
```

اجرا با `tsx` یا Bun:

```bash
npx tsx scripts/set-webhook.ts
# یا
bun scripts/set-webhook.ts
```

متغیرهای محیطی را قبل از اجرا تنظیم کنید:

```bash
# Linux / macOS
export BOT_TOKEN="توکن-ربات"
export WEBHOOK_URL="https://my-rubika-bot.<your-subdomain>.workers.dev/<WEBHOOK_SECRET>"
npx tsx scripts/set-webhook.ts
```

```powershell
# Windows PowerShell
$env:BOT_TOKEN="توکن-ربات"
$env:WEBHOOK_URL="https://my-rubika-bot.<your-subdomain>.workers.dev/<WEBHOOK_SECRET>"
npx tsx scripts/set-webhook.ts
```

بعد از این مرحله، روبیکا آپدیت‌ها را به Worker شما POST می‌کند.

> اگر آدرس Worker را تغییر دادید، اسکریپت را دوباره اجرا کنید تا Webhook به آدرس جدید اشاره کند.

### ۱۰. مشاهده لاگ‌ها

```bash
npx wrangler tail
```

با این دستور لاگ‌های لحظه‌ای Worker را در ترمینال می‌بینید. برای عیب‌یابی Webhook بسیار کاربردی است.

---

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

دریافت آرگومان‌های دستور:

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

مدیریت کلیک روی دکمه‌ها با `bot.action()`:

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

امکان ویرایش پیام و کیبورد نیز وجود دارد:

```ts
await ctx.editText(ctx.messageId, "متن جدید");

await ctx.editKeypad(ctx.messageId, keyboard);
```

## دسترسی مستقیم به API روبیکا

برای استفاده مستقیم از متدهای API روبیکا، می‌توانید از `bot.api` استفاده کنید.

```ts
const api = bot.api;

const me = await api.getMe();

await api.sendMessage({
  chat_id: "chat_id",
  text: "سلام!",
});
```

این بخش دسترسی به امکانات مختلف Bot API از جمله ارسال پیام، ارسال Poll، ارسال موقعیت، مدیریت اعضا، دریافت اطلاعات چت، ارسال فایل، دریافت آپدیت‌ها و موارد دیگر را فراهم می‌کند.

## مدیریت خطاها

برای مدیریت خطاهای ربات می‌توانید از `bot.catch()` استفاده کنید.

```ts
bot.catch(async (err, ctx) => {
  console.error("خطای ربات:", err);

  await ctx.reply("خطایی رخ داد. لطفاً دوباره تلاش کنید.").catch(() => {});
});
```

> `bot.catch()` خطاهای پردازش آپدیت‌ها را مدیریت می‌کند.

## ساختار پیشنهادی پروژه

```text
my-rubika-bot/
├── worker.ts          # نقطه ورود Worker
├── wrangler.toml      # تنظیمات Cloudflare
├── .dev.vars          # Secretهای محلی (در Git ذخیره نشود)
├── scripts/
│   └── set-webhook.ts # ثبت Webhook
├── src/
│   ├── bot.ts         # تعریف ربات و هندلرها
│   ├── handlers/
│   │   ├── start.ts
│   │   └── help.ts
│   ├── middleware/
│   │   └── admin.ts
│   └── utils/
│       └── keyboards.ts
└── package.json
```

## عیب‌یابی

**Worker پاسخ `404` می‌دهد**
آدرس Webhook باید دقیقاً به شکل `https://<worker-url>/<WEBHOOK_SECRET>` باشد و درخواست از نوع `POST`. مسیر و Secret را با هم مقایسه کنید.

**Webhook ثبت می‌شود ولی پیامی دریافت نمی‌کنم**
با `npx wrangler tail` لاگ‌ها را بررسی کنید. مطمئن شوید `WEBHOOK_URL` به Worker مستقرشده اشاره می‌کند و Worker فعال است.

**خطای احراز هویت یا `status_det` از روبیکا**
مقدار `BOT_TOKEN` را بررسی کنید. در Cloudflare با `npx wrangler secret put BOT_TOKEN` دوباره تنظیمش کنید و در محیط محلی از `.dev.vars` استفاده کنید.

**`wrangler login` مرورگر را باز نمی‌کند**
از API Token استفاده کنید و آن را در `CLOUDFLARE_API_TOKEN` قرار دهید. سپس `npx wrangler whoami` را اجرا کنید.

**خطای مربوط به KV**
مطمئن شوید Namespace ساخته شده و `id` درست در `wrangler.toml` قرار گرفته است. با `npx wrangler kv namespace list` می‌توانید Namespaceها را ببینید.

## مجوز

MIT
