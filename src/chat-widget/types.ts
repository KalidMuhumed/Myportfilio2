export type TenantId = "stadhjalpen";

export type ChatRole = "visitor" | "ai";

export type ScriptTurn = {
  role: ChatRole;
  text: string;
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
  theme: TenantTheme;
  autoPlayScript: ScriptTurn[];
};
