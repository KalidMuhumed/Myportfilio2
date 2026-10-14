import type { TenantConfig } from "@/chat-widget/types";

/**
 * ONLY tenant touched for the portfolio auto-play demo.
 * Do not copy these colors onto other tenants.
 */
export const stadhjalpenTenant: TenantConfig = {
  id: "stadhjalpen",
  brandName: "Städhjälpen Väst",
  statusLabel: "AI Assistent • Online",
  inputPlaceholder: "Skriv ett meddelande...",
  visitorInitial: "o",
  theme: {
    chatBg: "#1E1E1C",
    messageText: "#FBFBF9",
    accent: "#d97757",
    inputBorder: "rgba(255,255,255,0.08)",
    visitorBubble: "#4a322c",
    aiBubble: "#141413",
    aiBubbleBorder: "rgba(255,255,255,0.08)",
  },
  autoPlayScript: [
    {
      role: "visitor",
      text: "Hej! Har ni ledig tid för hemstädning i Göteborg på fredag?",
    },
    {
      role: "ai",
      text: "Hej! Absolut, vi kan hjälpa dig.",
    },
    {
      role: "visitor",
      text: "Vad har ni för tider?",
    },
    {
      role: "ai",
      text: "Vi har lucka kl. 09:00 och 13:00.",
    },
    {
      role: "visitor",
      text: "Kan jag boka 09:00?",
    },
    {
      role: "ai",
      text: "Självklart, ska jag boka 09:00 här i chatten?",
    },
  ],
};
