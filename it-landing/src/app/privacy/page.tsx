import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import config from "../../../site.config.json";

export const metadata: Metadata = {
  title: `Политика конфиденциальности — ${config.company.name}`,
  description: "Политика конфиденциальности и обработки персональных данных",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        На главную
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
        Политика конфиденциальности
      </h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-muted-foreground leading-relaxed mb-6">
          Настоящая Политика конфиденциальности персональных данных действует
          в отношении всей информации, которую {config.company.name} может
          получить о пользователе во время использования сайта.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
          1. Общие положения
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          1.1. Использование пользователем сайта означает согласие с настоящей
          Политикой конфиденциальности и условиями обработки персональных
          данных.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          1.2. В случае несогласия с условиями Политики конфиденциальности
          пользователь должен прекратить использование сайта.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
          2. Предмет политики конфиденциальности
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          2.1. Настоящая Политика конфиденциальности устанавливает обязательства
          администрации по неразглашению и обеспечению режима защиты
          конфиденциальности персональных данных, которые пользователь
          предоставляет по запросу администрации при регистрации на сайте или
          при оформлении заявки.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          2.2. Персональные данные, разрешённые к обработке в рамках настоящей
          Политики конфиденциальности, предоставляются пользователем путём
          заполнения формы обратной связи и включают в себя:
        </p>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
          <li>фамилию, имя пользователя;</li>
          <li>контактный телефон пользователя;</li>
          <li>адрес электронной почты (e-mail);</li>
          <li>сведения о проекте и сообщение пользователя.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
          3. Цели сбора персональной информации
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          3.1. Персональные данные пользователя администрация может использовать
          в целях:
        </p>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
          <li>Идентификации пользователя, оставившего заявку на сайте.</li>
          <li>
            Установления с пользователем обратной связи, включая направление
            уведомлений, запросов, касающихся использования сайта.
          </li>
          <li>
            Определения местонахождения пользователя для обеспечения
            безопасности, предотвращения мошенничества.
          </li>
          <li>
            Подтверждения достоверности и полноты персональных данных,
            предоставленных пользователем.
          </li>
          <li>
            Предоставления пользователю эффективной клиентской и технической
            поддержки при возникновении проблем, связанных с использованием
            сайта.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
          4. Обязательства сторон
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          4.1. Пользователь обязан предоставить достоверную информацию о
          персональных данных, необходимую для использования сайта.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          4.2. Администрация обязуется использовать полученную информацию
          исключительно для целей, указанных в настоящей Политике
          конфиденциальности.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          4.3. Администрация обязуется не передавать персональные данные
          третьим лицам без согласия пользователя, за исключением случаев,
          предусмотренных законодательством.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
          5. Контактная информация
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          По всем вопросам, связанным с обработкой персональных данных,
          обращайтесь по адресу электронной почты:{" "}
          <a
            href={`mailto:${config.company.email}`}
            className="text-primary hover:underline"
          >
            {config.company.email}
          </a>
          .
        </p>

        <p className="text-muted-foreground leading-relaxed mt-8">
          Дата последнего обновления: 22.04.2026
        </p>
      </div>
    </div>
  );
}