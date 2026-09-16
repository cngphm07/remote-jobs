export type SuggestedStatus = "REPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | null;

export type StatusSuggestion = {
  status: SuggestedStatus;
  confidence: "low" | "medium" | "high";
  reason: string;
  requiresConfirmation: true;
};

const rules: Array<{ status: Exclude<SuggestedStatus, null>; pattern: RegExp; reason: string }> = [
  { status: "OFFER", pattern: /\b(offer letter|pleased to offer|job offer|extend an offer)\b/i, reason: "Message contains offer language" },
  { status: "INTERVIEW", pattern: /\b(interview|schedule a call|availability|meet with|next round)\b/i, reason: "Message appears to request or discuss an interview" },
  { status: "REJECTED", pattern: /\b(unfortunately|not moving forward|other candidates|position has been filled|not selected)\b/i, reason: "Message contains rejection language" },
  { status: "REPLIED", pattern: /[\s\S]/, reason: "An inbound reply was received" },
];

export function suggestApplicationStatus(text: string, inbound = true): StatusSuggestion {
  if (!inbound || !text.trim()) {
    return { status: null, confidence: "low", reason: "No inbound message to classify", requiresConfirmation: true };
  }
  const match = rules.find((rule) => rule.pattern.test(text));
  return {
    status: match?.status ?? "REPLIED",
    confidence: match?.status === "REPLIED" ? "medium" : "high",
    reason: match?.reason ?? "An inbound reply was received",
    requiresConfirmation: true,
  };
}
