"use client";

import Image from "next/image";
import Link from "next/link";
import { useDictionary } from "@/i18n/LanguageProvider";

export function Footer() {
  const { footer } = useDictionary();

  const footerLinks = [
    { href: "/about", label: footer.about },
    { href: "/#contact", label: footer.contact },
  ];

  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Kalid Muhumed home">
            <Image
              src="/logo.svg"
              alt="Kalid Muhumed logo"
              width={164}
              height={164}
              className="h-4 w-auto md:h-[18px]"
            />
          </Link>
          <p className="text-sm text-muted">
            © 2026 Kalid Muhumed. Computer Engineering &amp; Automation.
          </p>
        </div>
        <nav aria-label={footer.aria}>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
