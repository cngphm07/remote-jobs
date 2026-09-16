import { z } from "zod";

export const draftRequestSchema = z.object({
  type: z.enum(["application", "follow_up", "recruiter_reply", "thank_you"]).default("application"),
  jobTitle: z.string().trim().min(1).max(200),
  company: z.string().trim().min(1).max(200),
  recipientName: z.string().trim().max(120).optional(),
  senderName: z.string().trim().min(1).max(120),
  portfolioUrl: z.string().url().optional(),
  experience: z.string().trim().max(1500).optional(),
  tone: z.enum(["concise", "professional", "friendly"]).default("professional"),
  context: z.string().trim().max(3000).optional(),
});

export type DraftRequest = z.infer<typeof draftRequestSchema>;
export type EmailDraft = { subject: string; body: string; source: "template" | "provider" };

const openings = {
  concise: "Hello",
  professional: "Dear",
  friendly: "Hi",
} as const;

export function generateFallbackDraft(input: DraftRequest): EmailDraft {
  const greeting = `${openings[input.tone]} ${input.recipientName || "Hiring Team"},`;
  const portfolio = input.portfolioUrl ? `\n\nPortfolio: ${input.portfolioUrl}` : "";
  const experience = input.experience ? ` ${input.experience}` : "";
  const context = input.context ? `\n\n${input.context}` : "";
  const signoff = `\n\nBest regards,\n${input.senderName}`;

  const templates: Record<DraftRequest["type"], { subject: string; body: string }> = {
    application: {
      subject: `Application for ${input.jobTitle} at ${input.company}`,
      body: `${greeting}\n\nI am writing to apply for the ${input.jobTitle} role at ${input.company}.${experience} I would welcome the opportunity to discuss how my work could support your team.${portfolio}${context}${signoff}`,
    },
    follow_up: {
      subject: `Following up: ${input.jobTitle} application`,
      body: `${greeting}\n\nI am following up on my application for the ${input.jobTitle} role at ${input.company}. I remain interested and would be glad to provide any additional information.${portfolio}${context}${signoff}`,
    },
    recruiter_reply: {
      subject: `Re: ${input.jobTitle} at ${input.company}`,
      body: `${greeting}\n\nThank you for getting in touch about the ${input.jobTitle} role at ${input.company}. I appreciate the message and would be happy to discuss the opportunity further.${context}${signoff}`,
    },
    thank_you: {
      subject: `Thank you — ${input.jobTitle} interview`,
      body: `${greeting}\n\nThank you for taking the time to speak with me about the ${input.jobTitle} role at ${input.company}. I enjoyed our conversation and remain excited about the opportunity.${context}${signoff}`,
    },
  };

  const result = templates[input.type];
  return { ...result, source: "template" };
}
