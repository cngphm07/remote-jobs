import { describe, expect, it } from "vitest";
import { draftRequestSchema, generateFallbackDraft } from "../draft";

describe("fallback email draft", () => {
  it("creates a draft but never marks it as sent", () => {
    const input = draftRequestSchema.parse({
      jobTitle: "Video Editor",
      company: "Example Studio",
      senderName: "Mai",
      portfolioUrl: "https://portfolio.example",
    });
    const draft = generateFallbackDraft(input);
    expect(draft.subject).toContain("Video Editor");
    expect(draft.body).toContain("https://portfolio.example");
    expect(draft.source).toBe("template");
    expect(draft).not.toHaveProperty("sent");
  });

  it("validates required facts", () => {
    expect(() => draftRequestSchema.parse({ company: "Example", senderName: "Mai" })).toThrow();
  });
});
