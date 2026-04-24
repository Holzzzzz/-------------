import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import config from "../../../../site.config.json";

// Простая in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
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

function containsHarmfulContent(content: string): boolean {
  const harmfulPatterns = [
    /ignore previous instructions/gi,
    /ignore all instructions/gi,
    /system prompt/gi,
    /you are now/gi,
    /DAN mode/gi,
    /jailbreak/gi,
  ];
  return harmfulPatterns.some((pattern) => pattern.test(content));
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте позже." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Некорректный формат сообщений" },
        { status: 400 }
      );
    }

    // Проверка на вредоносные промпты
    const lastMessage = messages[messages.length - 1]?.content || "";
    if (containsHarmfulContent(lastMessage)) {
      return NextResponse.json(
        { error: "Сообщение отклонено системой безопасности" },
        { status: 400 }
      );
    }

    // Проверка наличия API ключа
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Сервис временно недоступен. API ключ не настроен." },
        { status: 503 }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion = await openai.chat.completions.create({
      model: "qwen/qwen-2.5-7b-instruct",
      messages: [
        {
          role: "system",
          content: config.aiConsultant.systemPrompt,
        },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Ошибка обработки запроса" },
      { status: 500 }
    );
  }
}
