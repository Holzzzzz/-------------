/**
 * In-memory хранилище аналитики GPT-чата.
 * Собирает статистику по использованию чата для отправки в Telegram и внутреннего анализа.
 */

export interface ChatSession {
  id: string;
  startedAt: Date;
  lastActivityAt: Date;
  messagesCount: number;
  userMessagesCount: number;
  assistantMessagesCount: number;
  ip?: string;
  userAgent?: string;
}

export interface AnalyticsSnapshot {
  totalConversations: number;
  totalMessages: number;
  totalUserMessages: number;
  totalAssistantMessages: number;
  errorsCount: number;
  rateLimitHits: number;
  activeSessions: number;
  lastUpdated: Date;
}

// In-memory хранилище (для production рекомендуется перейти на Redis/PostgreSQL)
const sessions = new Map<string, ChatSession>();
const messageLog: Array<{
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  ip?: string;
}> = [];

let errorsCount = 0;
let rateLimitHits = 0;
const MAX_LOG_SIZE = 1000; // ограничение на количество сохранённых сообщений

/**
 * Создаёт новую сессию чата.
 */
export function createSession(
  ip?: string,
  userAgent?: string
): ChatSession {
  const session: ChatSession = {
    id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    startedAt: new Date(),
    lastActivityAt: new Date(),
    messagesCount: 0,
    userMessagesCount: 0,
    assistantMessagesCount: 0,
    ip,
    userAgent,
  };
  sessions.set(session.id, session);
  return session;
}

/**
 * Записывает сообщение в аналитику.
 */
export function logMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  ip?: string
): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.messagesCount += 1;
    session.lastActivityAt = new Date();
    if (role === "user") {
      session.userMessagesCount += 1;
    } else {
      session.assistantMessagesCount += 1;
    }
  }

  messageLog.push({
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sessionId,
    role,
    content: content.slice(0, 2000), // ограничение на длину
    timestamp: new Date(),
    ip,
  });

  // Ограничиваем размер лога
  if (messageLog.length > MAX_LOG_SIZE) {
    messageLog.splice(0, messageLog.length - MAX_LOG_SIZE);
  }
}

/**
 * Увеличивает счётчик ошибок API.
 */
export function incrementErrorCount(): void {
  errorsCount += 1;
}

/**
 * Увеличивает счётчик rate limit срабатываний.
 */
export function incrementRateLimit(): void {
  rateLimitHits += 1;
}

/**
 * Возвращает актуальную статистику.
 */
export function getAnalyticsSnapshot(): AnalyticsSnapshot {
  // Удаляем неактивные сессии старше 30 минут
  const cutoff = new Date(Date.now() - 30 * 60 * 1000);
  sessions.forEach((session, id) => {
    if (session.lastActivityAt < cutoff) {
      sessions.delete(id);
    }
  });

  return {
    totalConversations: sessions.size,
    totalMessages: messageLog.length,
    totalUserMessages: messageLog.filter((m) => m.role === "user").length,
    totalAssistantMessages: messageLog.filter((m) => m.role === "assistant").length,
    errorsCount,
    rateLimitHits,
    activeSessions: Array.from(sessions.values()).filter(
      (s) => s.lastActivityAt > new Date(Date.now() - 5 * 60 * 1000)
    ).length,
    lastUpdated: new Date(),
  };
}

/**
 * Возвращает последние сообщения пользователей.
 */
export function getRecentUserMessages(limit = 50): Array<{
  content: string;
  timestamp: Date;
  ip?: string;
  sessionId: string;
}> {
  return messageLog
    .filter((m) => m.role === "user")
    .slice(-limit)
    .map((m) => ({
      content: m.content,
      timestamp: m.timestamp,
      ip: m.ip,
      sessionId: m.sessionId,
    }));
}

/**
 * Возвращает все сессии.
 */
export function getAllSessions(): ChatSession[] {
  return Array.from(sessions.values());
}

/**
 * Полностью очищает аналитику (для админки).
 */
export function clearAnalytics(): void {
  sessions.clear();
  messageLog.length = 0;
  errorsCount = 0;
  rateLimitHits = 0;
}
