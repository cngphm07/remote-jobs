import { normalizeKey } from "./normalize";
import type { NormalizedJob } from "./types";

export const VIDEO_EDITOR_KEYWORDS = [
  "video editor",
  "video editing",
  "motion graphics",
  "motion designer",
  "post production",
  "youtube editor",
  "short form editor",
  "short form video",
] as const;

export function isRelevantVideoJob(job: Pick<NormalizedJob, "title" | "descriptionText" | "skills">): boolean {
  const title = normalizeKey(job.title);
  const body = normalizeKey(`${job.descriptionText} ${job.skills.join(" ")}`);

  if (VIDEO_EDITOR_KEYWORDS.some((keyword) => title.includes(normalizeKey(keyword)))) return true;

  const hasVideo = /\b(video|youtube|reels|tiktok)\b/.test(body);
  const hasEditing = /\b(edit|editing|editor|post production|motion graphics)\b/.test(body);
  return hasVideo && hasEditing;
}

const MAX_PUBLISHED_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/** A job can be shown only when it has not expired and its known publication date is recent. */
export function isActiveRecentJob(
  job: Pick<NormalizedJob, "publishedAt" | "expiresAt">,
  now = new Date(),
): boolean {
  if (job.expiresAt && job.expiresAt <= now) return false;
  if (job.publishedAt && now.getTime() - job.publishedAt.getTime() > MAX_PUBLISHED_AGE_MS) return false;
  return true;
}

export function filterRelevantJobs(jobs: NormalizedJob[], now = new Date()): NormalizedJob[] {
  return jobs.filter(isRelevantVideoJob).filter((job) => isActiveRecentJob(job, now));
}
