import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  notifyAdminContactForm,
  isTelegramEnabled,
} from "@/lib/telegram";

const formSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Описание должно содержать минимум 10 символов"),
});

// Простая in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = requestLog.get(ip) || [];
  const recentRequests = requests.filter(
    (time) => now - time < RATE_LIMIT_WINDOW
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  recentRequests.push(now);
  requestLog.set(ip, recentRequests);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Слишком много заявок. Попробуйте позже." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parseResult = formSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Некорректные данные формы", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = parseResult.data;

    // Отправляем уведомление в Telegram
    if (isTelegramEnabled()) {
      await notifyAdminContactForm({
        name,
        email,
        phone,
        message,
        ip,
        userAgent,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Ошибка обработки заявки" },
      { status: 500 }
    );
  }
}
