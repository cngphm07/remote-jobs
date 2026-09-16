import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { isAuthError, requireOwner } from "@/lib/auth/guard";
import { DatabaseUnavailableError } from "@/lib/gmail/repository";
import { GmailConfigurationError, GmailService } from "@/lib/gmail/service";
import { PrismaGmailRepository } from "@/lib/gmail/prisma-repository";
import { prisma } from "@/lib/prisma";

const sendSchema = z.object({
  confirmed: z.literal(true),
  to: z.string().email(),
  subject: z.string().trim().min(1).max(998),
  body: z.string().min(1).max(100_000),
  applicationId: z.string().trim().min(1).optional(),
  threadId: z.string().trim().min(1).optional(),
});

export async function POST(request: Request) {
  const owner = await requireOwner();
  if (isAuthError(owner)) return owner;

  try {
    const input = sendSchema.parse(await request.json());
    const result = await new GmailService(new PrismaGmailRepository(prisma)).send(owner.email, input);
    return NextResponse.json({ sent: true, ...result });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: { code: "CONFIRMATION_OR_INPUT_REQUIRED", message: "A valid email and confirmed=true are required", issues: error.issues } }, { status: 400 });
    }
    if (error instanceof GmailConfigurationError || error instanceof DatabaseUnavailableError) {
      return NextResponse.json({ error: { code: "GMAIL_UNAVAILABLE", message: error.message } }, { status: 503 });
    }
    return NextResponse.json({ error: { code: "SEND_FAILED", message: "Gmail could not send the message" } }, { status: 502 });
  }
}
