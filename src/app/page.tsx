import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { IntegrationsLoop } from "@/components/IntegrationsLoop";
import { Projects } from "@/components/Projects";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <IntegrationsLoop />
      <Contact />
    </>
  );
}
