import { NextResponse } from "next/server";
import { auth, authConfigured } from "@/lib/auth/config";
import { isOwnerEmail } from "@/lib/auth/config";

export type OwnerSession = { email: string };

export async function requireOwner(): Promise<OwnerSession | NextResponse> {
  if (!authConfigured) {
    return NextResponse.json(
      { error: { code: "AUTH_NOT_CONFIGURED", message: "Google authentication is not configured" } },
      { status: 503 },
    );
  }

  const session = await auth();
  if (!isOwnerEmail(session?.user?.email)) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Owner authentication is required" } },
      { status: 401 },
    );
  }
  return { email: session!.user!.email! };
}

export function isAuthError(value: OwnerSession | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}
