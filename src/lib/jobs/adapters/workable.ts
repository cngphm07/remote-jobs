import type { JobSourceAdapter, RawJob } from "../types";
import { fetchJson } from "./http";

interface WorkableJob {
  id?: string;
  shortcode?: string;
  title?: string;
  company?: { name?: string };
  company_name?: string;
  description?: string;
  location?: { countryName?: string; city?: string; region?: string; telecommuting?: boolean };
  employment_type?: string;
  url?: string;
  application_url?: string;
  created_at?: string;
  salary?: { min?: number; max?: number; currency?: string; interval?: string };
}

interface WorkableResponse {
  jobs?: WorkableJob[];
  results?: WorkableJob[];
}

export class WorkableAdapter implements JobSourceAdapter {
  readonly key = "workable" as const;
  constructor(
    private readonly endpoint = "https://jobs.workable.com/api/v1/jobs?query=video%20editor&remote=true",
  ) {}

  async fetchJobs(): Promise<RawJob[]> {
    try {
      const data = await fetchJson<WorkableResponse>(this.endpoint);
      const list = data.jobs || data.results || [];
      return list.map((job) => {
        const companyName = job.company?.name || job.company_name || "Workable Company";
        const locationStr = job.location
          ? [job.location.city, job.location.countryName].filter(Boolean).join(", ") || "Remote"
          : "Remote";
        const link = job.url || (job.shortcode ? `https://jobs.workable.com/view/${job.shortcode}` : "");

        let salary: string | null = null;
        if (job.salary?.min && job.salary?.max) {
          salary = `${job.salary.currency || "$"}${job.salary.min.toLocaleString()} - ${job.salary.currency || "$"}${job.salary.max.toLocaleString()} ${job.salary.interval || ""}`;
        }

        return {
          source: this.key,
          sourceJobId: job.shortcode || job.id || link,
          title: String(job.title ?? ""),
          company: companyName,
          description: job.description || "",
          location: locationStr,
          remoteRegion: "Worldwide",
          isRemote: true,
          employmentType: job.employment_type || "Full-time",
          salary,
          skills: ["Video Editing", "Workable"],
          sourceUrl: link,
          applyUrl: job.application_url || link,
          publishedAt: job.created_at ? new Date(job.created_at) : new Date(),
          rawData: job,
        };
      });
    } catch (err) {
      console.warn("Workable fetch warning:", err instanceof Error ? err.message : err);
      return [];
    }
  }
}
