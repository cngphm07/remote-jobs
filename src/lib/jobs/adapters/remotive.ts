import type { JobSourceAdapter, RawJob } from "../types";
import { fetchJson } from "./http";

interface RemotiveResponse {
  jobs?: Array<Record<string, unknown>>;
}

export class RemotiveAdapter implements JobSourceAdapter {
  readonly key = "remotive" as const;
  constructor(private readonly endpoint = "https://remotive.com/api/remote-jobs") {}

  async fetchJobs(): Promise<RawJob[]> {
    const data = await fetchJson<RemotiveResponse>(this.endpoint);
    return (data.jobs ?? []).map((job) => ({
      source: this.key,
      sourceJobId: String(job.id ?? ""),
      title: String(job.title ?? ""),
      company: String(job.company_name ?? "Unknown company"),
      description: String(job.description ?? ""),
      location: String(job.candidate_required_location ?? "Remote"),
      remoteRegion: String(job.candidate_required_location ?? "Worldwide"),
      isRemote: true,
      employmentType: job.job_type ? String(job.job_type) : null,
      salary: job.salary ? String(job.salary) : null,
      skills: Array.isArray(job.tags) ? job.tags.map(String) : [],
      sourceUrl: String(job.url ?? ""),
      applyUrl: String(job.url ?? ""),
      publishedAt: job.publication_date ? String(job.publication_date) : null,
      rawData: job,
    }));
  }
}
