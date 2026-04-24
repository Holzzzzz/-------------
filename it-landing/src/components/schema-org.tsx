"use client";

import Script from "next/script";
import config from "../../site.config.json";

export function SchemaOrg() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.company.name,
    description: config.company.description,
    url: "https://neurotech.dev",
    email: config.company.email,
    telephone: config.company.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Москва",
      streetAddress: config.company.address.replace("г. Москва, ", ""),
      addressCountry: "RU",
    },
    sameAs: Object.values(config.company.socials),
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: config.services.items.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Organization",
          name: config.company.name,
        },
      },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Какие услуги предоставляет NeuroTech Solutions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Мы предоставляем полный спектр IT-услуг: разработку ПО, IT-консалтинг, аутсорсинг, интеграцию систем, IT-аудит и кибербезопасность.",
        },
      },
      {
        "@type": "Question",
        name: "Какой минимальный бюджет проекта?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Минимальный бюджет проекта начинается от 500 000 рублей. Точная стоимость рассчитывается индивидуально после бесплатной консультации.",
        },
      },
      {
        "@type": "Question",
        name: "Какие сроки разработки?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MVP можно получить от 2 месяцев, полноценный проект занимает от 4 месяцев. Точные сроки зависят от сложности задачи.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-org-organization"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(organizationSchema)}
      </Script>
      <Script
        id="schema-org-services"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(servicesSchema)}
      </Script>
      <Script
        id="schema-org-faq"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(faqSchema)}
      </Script>
    </>
  );
}
