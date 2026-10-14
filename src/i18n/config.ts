import en from "@/dictionaries/en.json";
import sv from "@/dictionaries/sv.json";

export const locales = ["sv", "en"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = typeof sv;

export const defaultLocale: Locale = "sv";
export const LOCALE_STORAGE_KEY = "portfolio-locale";

export const dictionaries: Record<Locale, Dictionary> = {
  sv,
  en,
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
