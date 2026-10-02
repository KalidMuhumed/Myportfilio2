import Image from "next/image";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-10 sm:px-6"
    >
      <div
        aria-hidden
        className="animate-soft-glow pointer-events-none absolute inset-x-0 top-16 mx-auto h-[420px] w-[420px] max-w-[90vw] rounded-full bg-[radial-gradient(circle,rgba(217,119,87,0.12)_0%,transparent_68%)]"
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <div className="animate-fade-in relative mb-8 h-56 w-56 sm:h-64 sm:w-64">
          <div className="portrait-fade absolute inset-0 overflow-hidden">
            <Image
              src="/portrait-placeholder.svg"
              alt="Portrait placeholder for Kalid Muhumed"
              width={512}
              height={512}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/80 to-transparent"
          />
        </div>

        <h1 className="animate-fade-up font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl [animation-delay:120ms]">
          KALID MUHUMED
        </h1>

        <p className="animate-fade-up mt-4 text-xs font-medium uppercase tracking-[0.28em] text-muted sm:text-sm [animation-delay:240ms]">
          Fullstack Developer &amp; Automation.
        </p>

        <a
          href="#contact"
          className="animate-fade-up mt-10 inline-flex items-center justify-center rounded-md bg-accent px-7 py-3 text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-90 [animation-delay:360ms]"
        >
          Kontakta mig
        </a>
      </div>
    </section>
  );
}
