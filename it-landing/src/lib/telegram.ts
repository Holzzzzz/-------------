/**
 * Утилита для отправки сообщений в Telegram бот администратору.
 * Используется для уведомлений о событиях чата и аналитики.
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

/**
 * Проверяет, настроена ли интеграция с Telegram.
 */
export function isTelegramEnabled(): boolean {
  return !!TELEGRAM_BOT_TOKEN && !!TELEGRAM_ADMIN_CHAT_ID;
}

/**
 * Отправляет текстовое сообщение администратору через Telegram бот.
 */
export async function sendTelegramMessage(
  text: string,
  options?: { parse_mode?: "HTML" | "Markdown" | "MarkdownV2" }
): Promise<boolean> {
  if (!isTelegramEnabled()) {
    console.warn("[Telegram] Не настроены TELEGRAM_BOT_TOKEN или TELEGRAM_ADMIN_CHAT_ID");
    return false;
  }

  try {
    const url = `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: TELEGRAM_ADMIN_CHAT_ID,
      text: text.slice(0, 4096), // Telegram ограничение на длину сообщения
      parse_mode: options?.parse_mode ?? "HTML",
      disable_web_page_preview: true,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Telegram] Ошибка отправки:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Telegram] Ошибка сети:", error);
    return false;
  }
}

/**
 * Отправляет уведомление о новом сообщении пользователя в чате.
 */
export async function notifyAdminUserMessage(
  userMessage: string,
  context?: { ip?: string; userAgent?: string; timestamp?: string }
): Promise<boolean> {
  const time = context?.timestamp ?? new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  const meta = context?.ip ? `\n🌐 IP: ${context.ip}` : "";

  const text = `
<b>💬 Новое сообщение в GPT-чате</b>

🕒 <b>Время:</b> ${time}${meta}

👤 <b>Сообщение пользователя:</b>
<pre>${escapeHtml(userMessage.slice(0, 3000))}</pre>
  `.trim();

  return sendTelegramMessage(text, { parse_mode: "HTML" });
}

/**
 * Отправляет статистику использования чата администратору.
 */
export async function notifyAdminStats(stats: {
  totalConversations: number;
  totalMessages: number;
  totalUserMessages: number;
  totalAssistantMessages: number;
  errorsCount: number;
  rateLimitHits: number;
}): Promise<boolean> {
  const text = `
<b>📊 Статистика GPT-чата</b>

💬 Всего диалогов: <b>${stats.totalConversations}</b>
📝 Всего сообщений: <b>${stats.totalMessages}</b>
   ├ Пользователей: <b>${stats.totalUserMessages}</b>
   └ Ассистента: <b>${stats.totalAssistantMessages}</b>

⚠️ Ошибок API: <b>${stats.errorsCount}</b>
🚫 Rate limit срабатываний: <b>${stats.rateLimitHits}</b>

🕒 Обновлено: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}
  `.trim();

  return sendTelegramMessage(text, { parse_mode: "HTML" });
}

/**
 * Отправляет уведомление об ошибке в GPT-чате.
 */
export async function notifyAdminError(
  errorType: string,
  details: string
): Promise<boolean> {
  const text = `
<b>🚨 Ошибка в GPT-чате</b>

⚠️ Тип: <b>${escapeHtml(errorType)}</b>
🕒 Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}

📋 Детали:
<pre>${escapeHtml(details.slice(0, 3000))}</pre>
  `.trim();

  return sendTelegramMessage(text, { parse_mode: "HTML" });
}

/**
 * Отправляет уведомление о новой заявке из контактной формы.
 */
export async function notifyAdminContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  ip?: string;
  userAgent?: string;
}): Promise<boolean> {
  const time = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  const meta = data.ip ? `\n🌐 IP: ${data.ip}` : "";

  const text = `
<b>📩 Новая заявка с сайта</b>

🕒 <b>Время:</b> ${time}${meta}

👤 <b>Имя:</b> ${escapeHtml(data.name)}
📧 <b>Email:</b> ${escapeHtml(data.email)}
📞 <b>Телефон:</b> ${data.phone ? escapeHtml(data.phone) : "не указан"}

📝 <b>Сообщение:</b>
<pre>${escapeHtml(data.message.slice(0, 3000))}</pre>
  `.trim();

  return sendTelegramMessage(text, { parse_mode: "HTML" });
}

/**
 * Экранирует HTML-символы для Telegram API.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
