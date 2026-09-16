import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { isAuthError, requireOwner } from "@/lib/auth/guard";
import { DatabaseUnavailableError } from "@/lib/gmail/repository";
import { GmailConfigurationError, GmailService } from "@/lib/gmail/service";
import { PrismaGmailRepository } from "@/lib/gmail/prisma-repository";
import { prisma } from "@/lib/prisma";

const syncSchema = z.object({ maxResults: z.number().int().min(1).max(100).default(50) });

export async function POST(request: Request) {
  const owner = await requireOwner();
  if (isAuthError(owner)) return owner;

  try {
    const text = await request.text();
    const input = syncSchema.parse(text ? JSON.parse(text) : {});
    const result = await new GmailService(new PrismaGmailRepository(prisma)).sync(owner.email, input.maxResults);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "maxResults must be an integer between 1 and 100" } }, { status: 400 });
    }
    if (error instanceof GmailConfigurationError || error instanceof DatabaseUnavailableError) {
      return NextResponse.json({ error: { code: "GMAIL_UNAVAILABLE", message: error.message } }, { status: 503 });
    }
    return NextResponse.json({ error: { code: "SYNC_FAILED", message: "Gmail metadata sync failed" } }, { status: 502 });
  }
}
