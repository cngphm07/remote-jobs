import { prisma } from "@/lib/prisma";

const RECENT_PUBLISHED_DAYS = 30;
const RECENT_SEEN_DAYS = 7;

export type ActiveJobListItem = {
  id: string;
  title: string;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  skills: string[];
  sourceUrl: string;
  applyUrl: string | null;
  publishedAt: Date | null;
  lastSeenAt: Date;
  company: { name: string };
  source: { key: string; name: string };
};

export async function getActiveRecentJobs(limit = 100): Promise<ActiveJobListItem[]> {
  const now = new Date();
  const publishedCutoff = new Date(now.getTime() - RECENT_PUBLISHED_DAYS * 24 * 60 * 60 * 1000);
  const seenCutoff = new Date(now.getTime() - RECENT_SEEN_DAYS * 24 * 60 * 60 * 1000);

  return prisma.job.findMany({
    where: {
      isActive: true,
      lastSeenAt: { gte: seenCutoff },
      AND: [
        { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
        { OR: [{ publishedAt: null }, { publishedAt: { gte: publishedCutoff } }] },
      ],
    },
    include: {
      company: { select: { name: true } },
      source: { select: { key: true, name: true } },
    },
    orderBy: [{ publishedAt: "desc" }, { lastSeenAt: "desc" }],
    take: limit,
  });
}

export async function getLatestJobSyncSummary() {
  return prisma.syncRun.findFirst({
    where: { type: "JOBS", status: { in: ["SUCCEEDED", "PARTIAL"] } },
    orderBy: { finishedAt: "desc" },
    select: {
      finishedAt: true,
      fetchedCount: true,
      acceptedCount: true,
      createdCount: true,
      updatedCount: true,
      errorCount: true,
    },
  });
}
