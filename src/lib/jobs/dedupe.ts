import type { NormalizedJob } from "./types";

export interface DedupeResult {
  jobs: NormalizedJob[];
  duplicateCount: number;
}

export function dedupeJobs(jobs: NormalizedJob[]): DedupeResult {
  const seenSourceIds = new Set<string>();
  const seenUrls = new Set<string>();
  const seenFingerprints = new Set<string>();
  const unique: NormalizedJob[] = [];

  for (const job of jobs) {
    const sourceIdKey = job.sourceJobId ? `${job.source}:${job.sourceJobId}` : null;
    const duplicate =
      (sourceIdKey !== null && seenSourceIds.has(sourceIdKey)) ||
      seenUrls.has(job.sourceUrl) ||
      seenFingerprints.has(job.fingerprint);

    if (duplicate) continue;
    if (sourceIdKey) seenSourceIds.add(sourceIdKey);
    seenUrls.add(job.sourceUrl);
    seenFingerprints.add(job.fingerprint);
    unique.push(job);
  }

  return { jobs: unique, duplicateCount: jobs.length - unique.length };
}
