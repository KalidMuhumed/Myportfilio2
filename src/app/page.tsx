import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Projects } from "@/components/Projects";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Projects />
        {/* Anchor targets for remaining sections */}
        <div id="about" className="h-px scroll-mt-20" aria-hidden />
        <div id="contact" className="h-px scroll-mt-20" aria-hidden />
      </main>
    </>
  );
}
