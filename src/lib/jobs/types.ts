export const JOB_SOURCE_KEYS = [
  "remotive",
  "remoteok",
  "arbeitnow",
  "himalayas",
  "upwork_rss",
  "linkedin",
  "workable",
  "pickdi",
  "onlinejobs_ph",
  "manual",
] as const;
export type JobSourceKey = (typeof JOB_SOURCE_KEYS)[number];

export interface RawJob {
  source: JobSourceKey;
  sourceJobId?: string | null;
  title: string;
  company: string;
  description?: string | null;
  location?: string | null;
  country?: string | null;
  remoteRegion?: string | null;
  isRemote?: boolean | null;
  employmentType?: string | null;
  salary?: string | null;
  skills?: string[] | null;
  sourceUrl: string;
  applyUrl?: string | null;
  contactEmail?: string | null;
  publishedAt?: Date | string | number | null;
  expiresAt?: Date | string | number | null;
  rawData?: unknown;
}

export interface NormalizedJob {
  source: JobSourceKey;
  sourceJobId: string | null;
  title: string;
  company: string;
  normalizedCompany: string;
  description: string;
  descriptionText: string;
  location: string | null;
  country: string | null;
  remoteRegion: string | null;
  isRemote: boolean;
  employmentType: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  skills: string[];
  sourceUrl: string;
  applyUrl: string | null;
  contactEmail: string | null;
  publishedAt: Date | null;
  expiresAt: Date | null;
  contentHash: string;
  fingerprint: string;
  rawData?: unknown;
}

export interface JobSourceAdapter {
  readonly key: JobSourceKey;
  fetchJobs(): Promise<RawJob[]>;
}

export interface SyncStats {
  fetched: number;
  accepted: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
}

export interface JobSyncRepository {
  startRun(source: JobSourceKey): Promise<string>;
  upsertJob(job: NormalizedJob): Promise<"created" | "updated" | "skipped">;
  markSourceSucceeded(source: JobSourceKey, seenAt: Date): Promise<void>;
  markSourceFailed(source: JobSourceKey, message: string): Promise<void>;
  finishRun(runId: string, stats: SyncStats, errorMessage?: string): Promise<void>;
  pruneInactiveJobs(now: Date): Promise<void>;
}
