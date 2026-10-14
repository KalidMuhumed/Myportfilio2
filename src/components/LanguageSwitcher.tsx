"use client";

import { useDictionary, useLanguage } from "@/i18n/LanguageProvider";
import type { Locale } from "@/i18n/config";

const options: Locale[] = ["en", "sv"];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const { language } = useDictionary();

  return (
    <div
      className="flex items-center gap-1.5 text-xs font-medium tracking-[0.14em]"
      role="group"
      aria-label={language.switchAria}
    >
      {options.map((code, index) => (
        <span key={code} className="flex items-center gap-1.5">
          {index > 0 ? (
            <span className="text-muted" aria-hidden>
              |
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setLocale(code)}
            className={
              locale === code
                ? "text-foreground transition-colors"
                : "text-muted transition-colors hover:text-foreground"
            }
            aria-pressed={locale === code}
          >
            {language[code]}
          </button>
        </span>
      ))}
    </div>
  );
}
