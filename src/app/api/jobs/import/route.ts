import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthError, requireOwner } from "@/lib/auth/guard";
import { parseJobUrl } from "@/lib/jobs/single-url-parser";
import { PrismaJobSyncRepository } from "@/lib/jobs/sync";
import { prisma } from "@/lib/prisma";

const importSchema = z.object({
  url: z.string().url("Vui lòng nhập URL hợp lệ"),
});

export async function POST(request: Request) {
  const owner = await requireOwner();
  if (isAuthError(owner)) return owner;

  try {
    const body = await request.json();
    const { url } = importSchema.parse(body);

    const { raw, normalized } = await parseJobUrl(url);

    // Save to database
    const repo = new PrismaJobSyncRepository(prisma);
    const outcome = await repo.upsertJob(normalized);

    return NextResponse.json({
      success: true,
      outcome,
      job: {
        title: normalized.title,
        company: normalized.company,
        location: normalized.location,
        salary: raw.salary,
        source: normalized.source,
        sourceUrl: normalized.sourceUrl,
        applyUrl: normalized.applyUrl,
        skills: normalized.skills,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "INVALID_URL", message: error.issues[0]?.message || "URL không hợp lệ" } },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Không thể phân tích URL";
    return NextResponse.json(
      { error: { code: "IMPORT_FAILED", message } },
      { status: 500 },
    );
  }
}
