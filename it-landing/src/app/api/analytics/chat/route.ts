import { NextRequest, NextResponse } from "next/server";
import {
  getAnalyticsSnapshot,
  getRecentUserMessages,
  getAllSessions,
  clearAnalytics,
} from "../../../../lib/analytics";

/**
 * API endpoint для получения аналитики GPT-чата администратором.
 *
 * GET  /api/analytics/chat — получить текущую статистику
 * POST /api/analytics/chat — получить детальные данные или очистить
 */

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function verifyAdmin(request: NextRequest): boolean {
  // Для production рекомендуется использовать полноценную аутентификацию
  const secret = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET) {
    console.warn("[Analytics] ADMIN_SECRET не настроен — доступ без ограничений!");
    return true;
  }
  return secret === ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = getAnalyticsSnapshot();
  const recentMessages = getRecentUserMessages(20);

  return NextResponse.json({
    stats,
    recentMessages,
  });
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "clear") {
      clearAnalytics();
      return NextResponse.json({ ok: true, message: "Аналитика очищена" });
    }

    if (action === "sessions") {
      const sessions = getAllSessions();
      return NextResponse.json({ sessions });
    }

    if (action === "messages") {
      const limit = body.limit ?? 50;
      const messages = getRecentUserMessages(limit);
      return NextResponse.json({ messages });
    }

    if (action === "stats") {
      const stats = getAnalyticsSnapshot();
      return NextResponse.json({ stats });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
