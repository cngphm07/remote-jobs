import * as cheerio from "cheerio";
import type { JobSourceAdapter, RawJob } from "../types";
import { fetchText } from "./http";

export class OnlineJobsPhAdapter implements JobSourceAdapter {
  readonly key = "onlinejobs_ph" as const;
  constructor(
    private readonly searchUrl = "https://www.onlinejobs.ph/jobseekers/jobsearch?jobkeyword=video+editor",
  ) {}

  async fetchJobs(): Promise<RawJob[]> {
    try {
      const html = await fetchText(this.searchUrl);
      const $ = cheerio.load(html);
      const jobs: RawJob[] = [];

      $(".jobpost-cat, .latest-job-post, [data-temp='jobpost-cat']").each((_, el) => {
        const title = $(el).find("h4, .job-title, a[href*='/jobseekers/job/']").first().text().trim();
        const link = $(el).find("a[href*='/jobseekers/job/']").first().attr("href") || "";
        const desc = $(el).find(".desc, p").first().text().trim();
        const salary = $(el).find(".salary, .badge-salary, [class*='salary']").first().text().trim() || null;
        if (!title || !link) return;

        const fullUrl = link.startsWith("http") ? link : `https://www.onlinejobs.ph${link}`;
        const idMatch = fullUrl.match(/(\d+)$/);
        const jobId = idMatch ? idMatch[1] : fullUrl;

        jobs.push({
          source: this.key,
          sourceJobId: jobId,
          title,
          company: "OnlineJobs Client",
          description: desc || `${title} - Full-time / Part-time remote video editor role.`,
          location: "Remote / Worldwide",
          remoteRegion: "Worldwide",
          isRemote: true,
          employmentType: "Remote",
          salary,
          skills: ["Video Editing", "Premiere Pro", "OnlineJobs"],
          sourceUrl: fullUrl,
          applyUrl: fullUrl,
          // The source date is human-readable and cannot be reliably parsed without locale context.
          publishedAt: null,
          rawData: { link: fullUrl, title },
        });
      });

      return jobs;
    } catch (err) {
      console.warn("OnlineJobs.ph crawl warning:", err instanceof Error ? err.message : err);
      return [];
    }
  }
}
