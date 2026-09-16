import type { JobSourceAdapter, RawJob } from "../types";
import { fetchJson } from "./http";

interface ArbeitnowResponse {
  data?: Array<Record<string, unknown>>;
}

export class ArbeitnowAdapter implements JobSourceAdapter {
  readonly key = "arbeitnow" as const;
  constructor(private readonly endpoint = "https://www.arbeitnow.com/api/job-board-api") {}

  async fetchJobs(): Promise<RawJob[]> {
    const data = await fetchJson<ArbeitnowResponse>(this.endpoint);
    return (data.data ?? []).map((job) => ({
      source: this.key,
      sourceJobId: String(job.slug ?? job.url ?? ""),
      title: String(job.title ?? ""),
      company: String(job.company_name ?? "Unknown company"),
      description: String(job.description ?? ""),
      location: String(job.location ?? (job.remote ? "Remote" : "")),
      remoteRegion: job.remote ? "Europe/Worldwide" : null,
      isRemote: Boolean(job.remote),
      employmentType: Array.isArray(job.job_types) ? job.job_types.map(String).join(", ") : null,
      skills: Array.isArray(job.tags) ? job.tags.map(String) : [],
      sourceUrl: String(job.url ?? ""),
      applyUrl: String(job.url ?? ""),
      publishedAt: job.created_at ? Number(job.created_at) * 1000 : null,
      rawData: job,
    }));
  }
}
