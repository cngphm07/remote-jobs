import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isAuthError, requireOwner } from "@/lib/auth/guard";
import { draftRequestSchema, generateFallbackDraft } from "@/lib/email/draft";

export async function POST(request: Request) {
  const owner = await requireOwner();
  if (isAuthError(owner)) return owner;

  try {
    const input = draftRequestSchema.parse(await request.json());
    // Template mode is intentional when no external AI provider is configured.
    return NextResponse.json({ draft: generateFallbackDraft(input), sendRequired: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "Invalid draft input", issues: error.issues } }, { status: 400 });
    }
    return NextResponse.json({ error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } }, { status: 400 });
  }
}
