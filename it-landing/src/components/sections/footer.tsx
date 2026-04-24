"use client";

import Link from "next/link";
import config from "../../../site.config.json";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {config.company.name}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {config.company.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Навигация
            </h3>
            <ul className="space-y-2">
              {config.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Контакты
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${config.company.email}`}
                  className="inline-block hover:text-foreground transition-colors relative group"
                >
                  {config.company.email}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
              <li>
                <a
                  href={`tel:${config.company.phone.replace(/\s/g, "")}`}
                  className="inline-block hover:text-foreground transition-colors relative group"
                >
                  {config.company.phone}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
              <li>{config.company.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {config.footer.copyright}
          </p>
          <Link
            href={config.footer.privacyLink}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group inline-block"
          >
            {config.footer.privacyText}
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
