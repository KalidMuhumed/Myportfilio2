"use client";

import Image from "next/image";
import Link from "next/link";
import { useDictionary } from "@/i18n/LanguageProvider";

export function Hero() {
  const { hero } = useDictionary();

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 pb-16 pt-10 sm:px-6"
    >
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        {/* Glow is centered on the portrait so it expands evenly around it */}
        <div className="relative flex h-44 w-44 items-center justify-center md:h-52 md:w-52">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[-1px] z-0"
          >
            <div className="animate-portrait-glow h-full w-full rounded-full bg-[radial-gradient(circle,transparent_72%,rgba(217,119,87,0.45)_88%,rgba(217,119,87,0.2)_96%,transparent_100%)]" />
          </div>

          <div className="animate-fade-in relative z-10 h-full w-full overflow-hidden rounded-full">
            <Image
              fill
              src="/hero-portrait.jpg"
              alt={hero.portraitAlt}
              className="object-cover object-center"
              sizes="(max-width: 768px) 352px, 416px"
              quality={95}
              priority
            />
          </div>
        </div>

        <p className="animate-fade-up mt-3 text-center text-xs font-medium tracking-wide text-zinc-400 sm:text-sm [animation-delay:80ms]">
          {hero.name}
        </p>

        <h1 className="animate-fade-up mt-6 w-full px-2 font-sans text-[1.65rem] font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl [animation-delay:160ms] [overflow-wrap:anywhere]">
          <span className="block">{hero.titleLine1}</span>
          <span className="block">{hero.titleLine2}</span>
        </h1>

        <p className="animate-fade-up mt-5 max-w-lg px-2 text-base leading-relaxed text-muted sm:text-lg [animation-delay:240ms]">
          {hero.intro}
        </p>

        <Link
          href="/#contact"
          className="animate-fade-up mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c48a5a] to-[#a66b3f] px-7 py-3 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90 [animation-delay:320ms]"
        >
          {hero.cta}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
