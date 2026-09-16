import type { JobSourceAdapter, RawJob } from "../types";
import { fetchJson } from "./http";

interface HimalayasJob {
  id?: string | number;
  title?: string;
  companyName?: string;
  description?: string;
  excerpt?: string;
  locationRestrictions?: string[];
  minSalary?: number | null;
  maxSalary?: number | null;
  salaryCurrency?: string | null;
  salaryPeriod?: string | null;
  applicationLink?: string;
  guid?: string;
  pubDate?: string | number;
  expiryDate?: string | number;
  categories?: string[];
  skills?: Array<string | { name?: string }>;
}

interface HimalayasResponse {
  jobs?: HimalayasJob[];
}

export class HimalayasAdapter implements JobSourceAdapter {
  readonly key = "himalayas" as const;
  constructor(private readonly endpoint = "https://himalayas.app/jobs/api") {}

  async fetchJobs(): Promise<RawJob[]> {
    const data = await fetchJson<HimalayasResponse>(this.endpoint);
    return (data.jobs ?? []).map((job) => {
      const skills = Array.isArray(job.skills)
        ? job.skills.map((s) => (typeof s === "string" ? s : s.name || "")).filter(Boolean)
        : [];
      const location = Array.isArray(job.locationRestrictions) && job.locationRestrictions.length > 0
        ? job.locationRestrictions.join(", ")
        : "Worldwide";
      const salaryStr = job.minSalary && job.maxSalary
        ? `${job.salaryCurrency || "$"}${job.minSalary.toLocaleString()} - ${job.salaryCurrency || "$"}${job.maxSalary.toLocaleString()}${job.salaryPeriod ? ` / ${job.salaryPeriod}` : ""}`
        : job.minSalary
        ? `${job.salaryCurrency || "$"}${job.minSalary.toLocaleString()}+`
        : null;

      const sourceUrl = job.applicationLink || (job.guid ? `https://himalayas.app/jobs/${job.id || job.guid}` : `https://himalayas.app/jobs/${job.id}`);

      return {
        source: this.key,
        sourceJobId: job.id ? String(job.id) : job.guid ? String(job.guid) : null,
        title: String(job.title ?? ""),
        company: String(job.companyName ?? "Unknown company"),
        description: String(job.description || job.excerpt || ""),
        location,
        remoteRegion: location,
        isRemote: true,
        salary: salaryStr,
        skills,
        sourceUrl,
        applyUrl: job.applicationLink || sourceUrl,
        publishedAt: job.pubDate ? new Date(job.pubDate) : null,
        expiresAt: job.expiryDate ? new Date(job.expiryDate) : null,
        rawData: job,
      };
    });
  }
}
