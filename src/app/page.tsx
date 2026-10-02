import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        {/* Anchor targets for nav — sections land in a later pass */}
        <div id="about" className="h-px scroll-mt-20" aria-hidden />
        <div id="projects" className="h-px scroll-mt-20" aria-hidden />
        <div id="contact" className="h-px scroll-mt-20" aria-hidden />
      </main>
    </>
  );
}
