import type { JobSourceAdapter, RawJob } from "../types";
import { fetchJson } from "./http";

export class RemoteOkAdapter implements JobSourceAdapter {
  readonly key = "remoteok" as const;
  constructor(private readonly endpoint = "https://remoteok.com/api") {}

  async fetchJobs(): Promise<RawJob[]> {
    const data = await fetchJson<Array<Record<string, unknown>>>(this.endpoint);
    return data
      .filter((job) => job.id && (job.position || job.title))
      .map((job) => ({
        source: this.key,
        sourceJobId: String(job.id),
        title: String(job.position ?? job.title ?? ""),
        company: String(job.company ?? "Unknown company"),
        description: String(job.description ?? ""),
        location: String(job.location ?? "Remote"),
        remoteRegion: String(job.location ?? "Worldwide"),
        isRemote: true,
        employmentType: job.type ? String(job.type) : null,
        salary: [job.salary_min, job.salary_max].filter(Boolean).join(" - ") || null,
        skills: Array.isArray(job.tags) ? job.tags.map(String) : [],
        sourceUrl: String(job.url ?? `https://remoteok.com/remote-jobs/${job.id}`),
        applyUrl: job.apply_url ? String(job.apply_url) : String(job.url ?? ""),
        publishedAt: job.date ? String(job.date) : job.epoch ? Number(job.epoch) * 1000 : null,
        rawData: job,
      }));
  }
}
