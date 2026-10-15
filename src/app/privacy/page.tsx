import type { Metadata } from "next";
import { Privacy } from "@/components/Privacy";

export const metadata: Metadata = {
  title: "Integritet | Kalid Muhumed",
  description:
    "Hur Kalid Muhumed hanterar namn, e-post och meddelanden som skickas via kontaktformuläret.",
};

export default function PrivacyPage() {
  return <Privacy />;
}
