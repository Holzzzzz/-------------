import { NextResponse } from "next/server";
import { sendTelegramMessage, isTelegramEnabled } from "@/lib/telegram";

/**
 * Тестовый endpoint для проверки связи с Telegram ботом.
 * GET /api/telegram/test
 */
export async function GET() {
  const enabled = isTelegramEnabled();

  if (!enabled) {
    return NextResponse.json(
      {
        ok: false,
        error: "Telegram не настроен",
        details: {
          TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "есть" : "нет",
          TELEGRAM_ADMIN_CHAT_ID: process.env.TELEGRAM_ADMIN_CHAT_ID ? "есть" : "нет",
        },
      },
      { status: 503 }
    );
  }

  const testMessage = `✅ <b>Тестовое сообщение</b>\n\nБот успешно подключён!\nВремя: ${new Date().toLocaleString("ru-RU")}`;
  const sent = await sendTelegramMessage(testMessage, { parse_mode: "HTML" });

  if (sent) {
    return NextResponse.json({
      ok: true,
      message: "Тестовое сообщение отправлено в Telegram",
    });
  }

  return NextResponse.json(
    {
      ok: false,
      error: "Не удалось отправить сообщение. Проверьте токен и Chat ID.",
    },
    { status: 500 }
  );
}
