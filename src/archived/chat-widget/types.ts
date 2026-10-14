export type TenantId = "stadhjalpen";

export type ChatRole = "visitor" | "ai";

export type ScriptTurn =
  | {
      role: ChatRole;
      text: string;
    }
  | {
      role: "form";
      /** Shown as an in-chat booking card (not a text bubble) */
      fields: {
        firstName: string;
        lastName: string;
        email: string;
        slot: string;
      };
      submitLabel: string;
      submittedLabel: string;
    };

export type TenantTheme = {
  chatBg: string;
  messageText: string;
  accent: string;
  inputBorder: string;
  visitorBubble: string;
  aiBubble: string;
  aiBubbleBorder: string;
};

export type TenantConfig = {
  id: TenantId;
  brandName: string;
  statusLabel: string;
  inputPlaceholder: string;
  visitorInitial: string;
  aiEmoji: string;
  theme: TenantTheme;
  autoPlayScript: ScriptTurn[];
};
