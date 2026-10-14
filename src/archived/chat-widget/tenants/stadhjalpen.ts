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
  aiEmoji: "🧹",
  theme: {
    chatBg: "#1E1E1C",
    messageText: "#FBFBF9",
    accent: "#d97757",
    inputBorder: "rgba(255,255,255,0.08)",
    visitorBubble: "#5c3d36",
    aiBubble: "#151514",
    aiBubbleBorder: "rgba(255,255,255,0.10)",
  },
  // Visitor ↔ AI ↔ Visitor ↔ AI … (form is UI, not an AI text turn)
  autoPlayScript: [
    {
      role: "ai",
      text: "Hej! 👋 Hur kan jag hjälpa dig idag?",
    },
    {
      role: "visitor",
      text: "Hej! Har ni ledig tid för hemstädning i Göteborg på fredag? 🏠",
    },
    {
      role: "ai",
      text: "Absolut! ✨ Vad vill du ha hjälp med — info, offert eller boka tid?",
    },
    {
      role: "visitor",
      text: "Jag vill boka tid 🗓️",
    },
    {
      role: "ai",
      text: "Perfekt. Lediga tider på fredag: 09:00 och 13:00. 🧹 Fyll i formuläret så skickar vi din förfrågan.",
    },
    {
      role: "form",
      fields: {
        firstName: "Anna",
        lastName: "Andersson",
        email: "anna@email.com",
        slot: "Fredag 09:00",
      },
      submitLabel: "Skicka förfrågan",
      submittedLabel: "Skickat",
    },
    {
      role: "ai",
      text: "Tack! ✅ Din bokningsförfrågan är skickad. Vi återkommer snart.",
    },
  ],
};
