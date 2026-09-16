import { NextResponse } from "next/server";
import {
  ArbeitnowAdapter,
  HimalayasAdapter,
  LinkedInAdapter,
  OnlineJobsPhAdapter,
  PickdiAdapter,
  RemotiveAdapter,
  RemoteOkAdapter,
  UpworkRssAdapter,
  WorkableAdapter,
} from "@/lib/jobs/adapters";
import { JobSyncService, PrismaJobSyncRepository } from "@/lib/jobs/sync";
import { prisma } from "@/lib/prisma";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  // If no secret configured, reject or check Vercel Cron header
  if (secret && header === `Bearer ${secret}`) return true;
  // Vercel Cron sends header 'x-vercel-cron'
  if (request.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Cron secret is invalid" } },
      { status: 401 },
    );
  }

  const service = new JobSyncService(new PrismaJobSyncRepository(prisma));
  const adapters = [
    new RemotiveAdapter(),
    new RemoteOkAdapter(),
    new ArbeitnowAdapter(),
    new HimalayasAdapter(),
    new UpworkRssAdapter(),
    new LinkedInAdapter(),
    new WorkableAdapter(),
    new PickdiAdapter(),
    new OnlineJobsPhAdapter(),
  ];

  const results = await service.syncAll(adapters);
  const payload = results.map((result, idx) =>
    result.status === "fulfilled"
      ? result.value
      : {
          source: adapters[idx].key,
          error: result.reason instanceof Error ? result.reason.message : "Unknown sync failure",
        },
  );

  return NextResponse.json(
    { results: payload, syncedAt: new Date().toISOString() },
    { status: results.every((item) => item.status === "fulfilled") ? 200 : 207 },
  );
}

// Support GET for Vercel Cron invocations if triggered via GET
export async function GET(request: Request) {
  return POST(request);
}
