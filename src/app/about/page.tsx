import type { Metadata } from "next";
import { About } from "@/components/About";

export const metadata: Metadata = {
  title: "About | Kalid Muhumed",
  description:
    "Bakgrund, utbildning och tekniska färdigheter hos Kalid Muhumed.",
};

export default function AboutPage() {
  return <About />;
}
