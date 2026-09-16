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

export function filterRelevantJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  return jobs.filter(isRelevantVideoJob);
}
