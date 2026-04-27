import { NextRequest, NextResponse } from "next/server";

/**
 * Telegram Bot Webhook Handler
 *
 * Принимает обновления от Telegram бота через webhook.
 * Используется для двусторонней связи: бот может запрашивать
 * статистику или управлять функциями сайта.
 *
 * URL для настройки webhook:
 * POST https://api.telegram.org/bot<TOKEN>/setWebhook
 * { "url": "https://your-domain.com/api/telegram/webhook" }
 */

const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

/**
 * Проверяет подпись webhook-запроса от Telegram.
 * Telegram отправляет секретный токен в заголовке X-Telegram-Bot-Api-Secret-Token
 * при создании webhook с параметром secret_token.
 */
function verifyWebhookSecret(request: NextRequest): boolean {
  if (!WEBHOOK_SECRET) {
    // Если секрет не настроен, пропускаем проверку (только для разработки!)
    console.warn("[Telegram Webhook] TELEGRAM_WEBHOOK_SECRET не настроен — проверка отключена");
    return true;
  }
  const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
  return headerSecret === WEBHOOK_SECRET;
}

export async function POST(request: NextRequest) {
  try {
    // Проверка секрета
    if (!verifyWebhookSecret(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update = await request.json();

    // Обработка входящего сообщения от Telegram
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      const userName = update.message.from?.username || update.message.from?.first_name || "Админ";

      console.log(`[Telegram] Сообщение от ${userName}: ${text}`);

      // Простые команды бота
      const command = text.toLowerCase().trim();

      if (command === "/start") {
        await sendTelegramResponse(chatId, `
👋 <b>Привет, ${userName}!</b>

Я бот для мониторинга GPT-чата на сайте NeuroTech Solutions.

<b>Доступные команды:</b>
📊 /stats — статистика чата
📋 /messages — последние сообщения пользователей
🧹 /clear — очистить аналитику
❓ /help — справка
        `);
      } else if (command === "/stats") {
        // Получаем статистику через внутренний запрос
        const stats = await fetchStats();
        await sendTelegramResponse(chatId, stats);
      } else if (command === "/messages") {
        const messages = await fetchMessages();
        await sendTelegramResponse(chatId, messages);
      } else if (command === "/clear") {
        await clearAnalytics();
        await sendTelegramResponse(chatId, "✅ Аналитика очищена");
      } else if (command === "/help") {
        await sendTelegramResponse(chatId, `
<b>📖 Справка по командам</b>

/stats — показать статистику использования GPT-чата
/messages — показать последние сообщения пользователей
/clear — очистить всю аналитику (осторожно!)
/help — эта справка

<b>Автоматические уведомления:</b>
• Новые сообщения пользователей
• Ошибки API
• Статистика каждые N сообщений
        `);
      } else {
        await sendTelegramResponse(chatId, "❓ Неизвестная команда. Используй /help для справки.");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Telegram Webhook] Ошибка:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * Отправляет ответ обратно в Telegram чат.
 */
async function sendTelegramResponse(chatId: number, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("[Telegram Webhook] TELEGRAM_BOT_TOKEN не настроен");
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 4096),
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("[Telegram Webhook] Ошибка отправки ответа:", error);
  }
}

/**
 * Запрашивает статистику через внутренний API endpoint.
 */
async function fetchStats(): Promise<string> {
  try {
    // Для in-memory хранилища делаем прямой импорт
    const { getAnalyticsSnapshot } = await import("../../../../lib/analytics");
    const stats = getAnalyticsSnapshot();

    return `
<b>📊 Статистика GPT-чата</b>

💬 Всего диалогов: <b>${stats.totalConversations}</b>
📝 Всего сообщений: <b>${stats.totalMessages}</b>
   ├ Пользователей: <b>${stats.totalUserMessages}</b>
   └ Ассистента: <b>${stats.totalAssistantMessages}</b>

⚠️ Ошибок API: <b>${stats.errorsCount}</b>
🚫 Rate limit: <b>${stats.rateLimitHits}</b>
🔥 Активных сессий (5 мин): <b>${stats.activeSessions}</b>

🕒 Обновлено: ${stats.lastUpdated.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}
    `.trim();
  } catch {
    return "❌ Ошибка получения статистики";
  }
}

/**
 * Запрашивает последние сообщения пользователей.
 */
async function fetchMessages(): Promise<string> {
  try {
    const { getRecentUserMessages } = await import("../../../../lib/analytics");
    const messages = getRecentUserMessages(20);

    if (messages.length === 0) {
      return "📭 Пока нет сообщений от пользователей.";
    }

    const lines = messages.map((m, i) => {
      const time = m.timestamp.toLocaleString("ru-RU", {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      });
      const content = m.content.slice(0, 150).replace(/[<>]/g, "");
      return `${i + 1}. [${time}] ${content}${m.content.length > 150 ? "..." : ""}`;
    });

    return `
<b>📋 Последние сообщения пользователей</b>

${lines.join("\n")}
    `.trim();
  } catch {
    return "❌ Ошибка получения сообщений";
  }
}

/**
 * Очищает аналитику.
 */
async function clearAnalytics(): Promise<void> {
  try {
    const { clearAnalytics } = await import("../../../../lib/analytics");
    clearAnalytics();
  } catch (error) {
    console.error("[Telegram Webhook] Ошибка очистки:", error);
  }
}
