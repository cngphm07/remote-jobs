import * as cheerio from "cheerio";
import type { JobSourceAdapter, RawJob } from "../types";
import { fetchText } from "./http";

export class LinkedInAdapter implements JobSourceAdapter {
  readonly key = "linkedin" as const;
  constructor(
    private readonly searchUrls: string[] = [
      "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=remote+video+editor&location=Worldwide&f_TPR=r604800",
      "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=video+editor&location=Vietnam&f_TPR=r604800",
    ],
  ) {}

  async fetchJobs(): Promise<RawJob[]> {
    const jobs: RawJob[] = [];

    for (const url of this.searchUrls) {
      try {
        const html = await fetchText(url, {
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        });
        const $ = cheerio.load(html);

        $("li").each((_, el) => {
          const title = $(el).find(".base-search-card__title").text().trim();
          const company = $(el).find(".base-search-card__subtitle").text().trim() || "LinkedIn Employer";
          const location = $(el).find(".job-search-card__location").text().trim() || "Remote";
          const link = $(el).find("a.base-card__full-link").attr("href") || "";
          const dateStr = $(el).find("time").attr("datetime") || "";
          const urn = $(el).find("[data-entity-urn]").attr("data-entity-urn") || "";

          if (!title || !link) return;

          const cleanUrl = link.split("?")[0];
          const jobIdMatch = cleanUrl.match(/(\d+)$/);
          const jobId = jobIdMatch ? jobIdMatch[1] : urn || cleanUrl;

          jobs.push({
            source: this.key,
            sourceJobId: jobId,
            title,
            company,
            description: `${title} at ${company}. Location: ${location}. Apply on LinkedIn.`,
            location,
            remoteRegion: location.toLowerCase().includes("vietnam") ? "Vietnam / APAC" : "Worldwide",
            isRemote: true,
            skills: ["Video Editing", "LinkedIn"],
            sourceUrl: cleanUrl,
            applyUrl: cleanUrl,
            publishedAt: dateStr ? new Date(dateStr) : new Date(),
            rawData: { urn, link: cleanUrl },
          });
        });
      } catch (err) {
        console.warn(`LinkedIn crawl warning for ${url}:`, err instanceof Error ? err.message : err);
      }
    }

    return jobs;
  }
}
