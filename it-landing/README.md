# NeuroTech Solutions — Лендинг IT-компании
cd "c:\Users\AdminCyberhub\Desktop\Сайт Гайчиков\it-landing"
npm run dev

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

Современный одностраничный лендинг для IT-компании с ИИ-консультантом, адаптивной версткой и поддержкой темной/светлой темы.

## Технологический стек

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Framer Motion** — анимации
- **next-themes** — темная/светлая тема
- **React Hook Form + Zod** — валидация форм
- **OpenAI API** — ИИ-консультант

## Структура проекта

```
it-landing/
├── site.config.json          # Конфигурация контента сайта
├── .env.example              # Пример переменных окружения
├── src/
│   ├── app/
│   │   ├── api/chat/         # API route для ИИ-консультанта
│   │   │   └── route.ts
│   │   ├── globals.css       # Глобальные стили
│   │   ├── layout.tsx        # Корневой layout с SEO
│   │   ├── page.tsx          # Главная страница
│   │   ├── robots.ts         # robots.txt
│   │   └── sitemap.ts        # sitemap.xml
│   ├── components/
│   │   ├── ui/               # Компоненты shadcn/ui
│   │   ├── ai-chat.tsx       # Виджет ИИ-консультанта
│   │   ├── navbar.tsx        # Фиксированное меню
│   │   ├── schema-org.tsx    # Schema.org разметка
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── sections/         # Секции лендинга
│   │       ├── hero.tsx
│   │       ├── services.tsx
│   │       ├── process.tsx
│   │       ├── cases.tsx
│   │       ├── contacts.tsx
│   │       └── footer.tsx
│   └── lib/
│       └── utils.ts
```

## Запуск локально

```bash
# Установка зависимостей
npm install

# Создание .env файла
# Скопируйте .env.example в .env и добавьте ваш OPENAI_API_KEY

# Запуск dev-сервера
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Переменные окружения

| Переменная | Описание | Обязательная |
|------------|----------|--------------|
| `OPENAI_API_KEY` | API ключ OpenAI для ИИ-консультанта | Да |

## Настройка контента

Весь контент сайта управляется через файл `site.config.json` в корне проекта. Изменяйте:

- `company` — информация о компании
- `seo` — метаданные
- `navigation` — пункты меню
- `hero` — заголовок и CTA
- `services` — список услуг
- `process` — этапы работы
- `cases` — кейсы и партнеры
- `contacts` — контактная информация
- `aiConsultant` — настройки ИИ-консультанта

## ИИ-консультант

ИИ-консультант работает через серверный Route Handler (`/api/chat`), что обеспечивает:
- Защиту API-ключа на сервере
- Rate limiting (10 запросов/минуту с одного IP)
- Фильтрацию вредоносных промптов
- Отсутствие хранения персональных данных

## Деплой

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --build
```

Не забудьте добавить переменную окружения `OPENAI_API_KEY` в настройках платформы деплоя.

## SEO

- Семантическая HTML5-разметка
- Open Graph и Twitter Cards
- Schema.org: Organization, Service, FAQPage
- robots.txt и sitemap.xml
- Оптимизация изображений через next/image

## Лицензия

MIT
