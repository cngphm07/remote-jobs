import type { JobSourceAdapter, RawJob } from "../types";

interface VietnamWorksJobItem {
  jobId?: number | string;
  jobTitle?: string;
  companyName?: string;
  companyLogo?: string;
  jobDescription?: string;
  jobRequirement?: string;
  prettySalary?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryDisplayType?: number;
  jobUrl?: string;
  workingLocations?: Array<{ locationName?: string; cityName?: string }>;
  address?: string;
  skills?: Array<{ skillName?: string } | string>;
  approvedOn?: string;
  expiredOn?: string;
}

interface VietnamWorksSearchResponse {
  data?: VietnamWorksJobItem[];
  meta?: { total?: number };
}

export class VietnamWorksAdapter implements JobSourceAdapter {
  readonly key = "vietnamworks" as const;

  constructor(
    private readonly endpoint = "https://ms.vietnamworks.com/job-search/v1.0/search",
    private readonly queries: string[] = [
      "video editor",
      "dựng phim",
      "dựng video",
      "motion graphics",
      "video",
    ],
  ) {}

  async fetchJobs(): Promise<RawJob[]> {
    const jobsMap = new Map<string, RawJob>();

    for (const query of this.queries) {
      try {
        const response = await fetch(this.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 RemoteCut/1.0",
          },
          body: JSON.stringify({
            query,
            page: 0,
            hitsPerPage: 50,
          }),
        });

        if (!response.ok) {
          console.warn(`VietnamWorks search returned HTTP ${response.status} for query "${query}"`);
          continue;
        }

        const resData = (await response.json()) as VietnamWorksSearchResponse;
        const list = resData.data || [];

        for (const item of list) {
          if (!item.jobTitle || !item.jobId) continue;

          const jobIdStr = String(item.jobId);
          if (jobsMap.has(jobIdStr)) continue;

          const company = item.companyName || "VietnamWorks Employer";
          const skills: string[] = Array.isArray(item.skills)
            ? item.skills
                .map((s) => (typeof s === "string" ? s : s.skillName || ""))
                .filter(Boolean)
            : ["Video Editing"];

          const locations = Array.isArray(item.workingLocations)
            ? item.workingLocations
                .map((loc) => loc.cityName || loc.locationName || "")
                .filter(Boolean)
                .join(", ")
            : item.address || "Vietnam / Remote";

          const description = [item.jobDescription, item.jobRequirement].filter(Boolean).join("\n\n");

          let salary: string | null = null;
          if (item.prettySalary && item.prettySalary !== "Thương lượng") {
            salary = item.prettySalary;
          } else if (item.salaryMin && item.salaryMax) {
            salary = `${item.salaryMin.toLocaleString()} - ${item.salaryMax.toLocaleString()} ${item.salaryCurrency || "VND"}`;
          }

          const rawJob: RawJob = {
            source: this.key,
            sourceJobId: jobIdStr,
            title: item.jobTitle.trim(),
            company: company.trim(),
            description: description || `${item.jobTitle} at ${company}`,
            location: locations || "Vietnam / Remote",
            remoteRegion: "Vietnam / APAC",
            isRemote: true,
            employmentType: "Full-time / Remote",
            salary,
            skills,
            sourceUrl: item.jobUrl || `https://www.vietnamworks.com/job-${item.jobId}-jv`,
            applyUrl: item.jobUrl || `https://www.vietnamworks.com/job-${item.jobId}-jv`,
            publishedAt: item.approvedOn ? new Date(item.approvedOn) : null,
            expiresAt: item.expiredOn ? new Date(item.expiredOn) : null,
            rawData: item,
          };

          jobsMap.set(jobIdStr, rawJob);
        }
      } catch (err) {
        console.warn(
          `VietnamWorks fetch error for query "${query}":`,
          err instanceof Error ? err.message : err,
        );
      }
    }

    return Array.from(jobsMap.values());
  }
}
