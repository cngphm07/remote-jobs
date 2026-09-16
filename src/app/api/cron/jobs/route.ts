import { NextResponse } from "next/server";
import {
  ArbeitnowAdapter,
  HimalayasAdapter,
  LinkedInAdapter,
  PickdiAdapter,
  RemotiveAdapter,
  RemoteOkAdapter,
  UpworkRssAdapter,
  VietnamWorksAdapter,
  WorkableAdapter,
} from "@/lib/jobs/adapters";
import { JobSyncService, PrismaJobSyncRepository } from "@/lib/jobs/sync";
import { prisma } from "@/lib/prisma";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  if (secret && header === `Bearer ${secret}`) return true;
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
    new VietnamWorksAdapter(),
    new LinkedInAdapter(),
    new UpworkRssAdapter(),
    new WorkableAdapter(),
    new HimalayasAdapter(),
    new RemotiveAdapter(),
    new RemoteOkAdapter(),
    new ArbeitnowAdapter(),
    new PickdiAdapter(),
  ];

  const results = await service.syncAll(adapters);
  await service.pruneInactiveJobs();

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

export async function GET(request: Request) {
  return POST(request);
}
