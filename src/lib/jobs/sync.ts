import type { Prisma, PrismaClient } from "@prisma/client";
import { dedupeJobs } from "./dedupe";
import { filterRelevantJobs, isActiveRecentJob } from "./filter";
import { normalizeJob } from "./normalize";
import type { JobSourceAdapter, JobSourceKey, JobSyncRepository, NormalizedJob, SyncStats } from "./types";

export interface SyncResult extends SyncStats {
  source: JobSourceKey;
  runId: string;
}

export class JobSyncService {
  constructor(private readonly repository: JobSyncRepository) {}

  async sync(adapter: JobSourceAdapter): Promise<SyncResult> {
    const runId = await this.repository.startRun(adapter.key);
    const stats: SyncStats = { fetched: 0, accepted: 0, created: 0, updated: 0, skipped: 0, errors: 0 };

    try {
      const rawJobs = await adapter.fetchJobs();
      stats.fetched = rawJobs.length;
      const normalized: NormalizedJob[] = [];
      for (const raw of rawJobs) {
        try {
          normalized.push(normalizeJob(raw));
        } catch {
          stats.errors += 1;
        }
      }

      const relevant = filterRelevantJobs(normalized);
      const deduped = dedupeJobs(relevant);
      stats.accepted = deduped.jobs.length;
      stats.skipped = rawJobs.length - deduped.jobs.length - stats.errors;

      for (const job of deduped.jobs) {
        try {
          const outcome = await this.repository.upsertJob(job);
          stats[outcome] += 1;
        } catch {
          stats.errors += 1;
        }
      }

      await this.repository.markSourceSucceeded(adapter.key, new Date());
      await this.repository.finishRun(runId, stats, stats.errors ? `${stats.errors} job(s) failed` : undefined);
      return { source: adapter.key, runId, ...stats };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync error";
      stats.errors += 1;
      await this.repository.markSourceFailed(adapter.key, message);
      await this.repository.finishRun(runId, stats, message);
      throw error;
    }
  }

  async syncAll(adapters: JobSourceAdapter[]): Promise<PromiseSettledResult<SyncResult>[]> {
    return Promise.allSettled(adapters.map((adapter) => this.sync(adapter)));
  }

  async pruneInactiveJobs(now = new Date()): Promise<void> {
    await this.repository.pruneInactiveJobs(now);
  }
}

export class PrismaJobSyncRepository implements JobSyncRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async startRun(source: JobSourceKey): Promise<string> {
    const sourceRow = await this.requireSource(source);
    const run = await this.prisma.syncRun.create({ data: { sourceId: sourceRow.id, type: "JOBS", status: "RUNNING" } });
    return run.id;
  }

  async upsertJob(job: NormalizedJob): Promise<"created" | "updated" | "skipped"> {
    const source = await this.requireSource(job.source);
    const existing = await this.prisma.job.findFirst({
      where: {
        OR: [
          ...(job.sourceJobId ? [{ sourceId: source.id, sourceJobId: job.sourceJobId }] : []),
          { sourceId: source.id, sourceUrl: job.sourceUrl },
          { fingerprint: job.fingerprint },
        ],
      },
      select: { id: true, contentHash: true },
    });
    if (existing?.contentHash === job.contentHash) {
      const now = new Date();
      const active = isActiveRecentJob(job, now);
      await this.prisma.job.update({
        where: { id: existing.id },
        data: { lastSeenAt: now, isActive: active, staleAt: active ? null : now },
      });
      return "skipped";
    }

    const company = await this.prisma.company.upsert({
      where: { normalizedName: job.normalizedCompany },
      update: { name: job.company },
      create: { name: job.company, normalizedName: job.normalizedCompany },
    });
    const data = this.toJobData(job, source.id, company.id);
    if (existing) {
      await this.prisma.job.update({ where: { id: existing.id }, data });
      return "updated";
    }
    await this.prisma.job.create({ data });
    return "created";
  }

  async markSourceSucceeded(source: JobSourceKey, seenAt: Date): Promise<void> {
    await this.prisma.jobSource.update({ where: { key: source }, data: { lastSyncedAt: seenAt, lastSuccessfulAt: seenAt, lastError: null } });
  }

  async markSourceFailed(source: JobSourceKey, message: string): Promise<void> {
    await this.prisma.jobSource.update({ where: { key: source }, data: { lastSyncedAt: new Date(), lastError: message } });
  }

  async pruneInactiveJobs(now: Date): Promise<void> {
    const staleCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    await this.prisma.job.updateMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: { lte: now } },
          { lastSeenAt: { lt: staleCutoff } },
        ],
      },
      data: { isActive: false, staleAt: now },
    });
  }

  async finishRun(runId: string, stats: SyncStats, errorMessage?: string): Promise<void> {
    await this.prisma.syncRun.update({
      where: { id: runId },
      data: {
        status: errorMessage ? (stats.accepted > 0 ? "PARTIAL" : "FAILED") : "SUCCEEDED",
        finishedAt: new Date(),
        fetchedCount: stats.fetched,
        acceptedCount: stats.accepted,
        createdCount: stats.created,
        updatedCount: stats.updated,
        skippedCount: stats.skipped,
        errorCount: stats.errors,
        errorMessage,
      },
    });
  }

  private async requireSource(key: JobSourceKey) {
    const source = await this.prisma.jobSource.findUnique({ where: { key } });
    if (!source) throw new Error(`Job source '${key}' has not been seeded`);
    return source;
  }

  private toJobData(job: NormalizedJob, sourceId: string, companyId: string): Prisma.JobUncheckedCreateInput {
    return {
      sourceId,
      sourceJobId: job.sourceJobId,
      companyId,
      title: job.title,
      description: job.description,
      descriptionText: job.descriptionText,
      location: job.location,
      country: job.country,
      remoteRegion: job.remoteRegion,
      isRemote: job.isRemote,
      employmentType: job.employmentType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: job.salaryCurrency,
      skills: job.skills,
      sourceUrl: job.sourceUrl,
      applyUrl: job.applyUrl,
      contactEmail: job.contactEmail,
      publishedAt: job.publishedAt,
      expiresAt: job.expiresAt,
      lastSeenAt: new Date(),
      isActive: isActiveRecentJob(job),
      staleAt: isActiveRecentJob(job) ? null : new Date(),
      contentHash: job.contentHash,
      fingerprint: job.fingerprint,
      rawData: job.rawData as Prisma.InputJsonValue | undefined,
    };
  }
}
