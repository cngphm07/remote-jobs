import * as cheerio from "cheerio";
import type { JobSourceAdapter, RawJob } from "../types";
import { fetchText } from "./http";

export class PickdiAdapter implements JobSourceAdapter {
  readonly key = "pickdi" as const;
  constructor(
    private readonly listingUrl = "https://pickdi.com/jobs?category=video-editing",
  ) {}

  async fetchJobs(): Promise<RawJob[]> {
    try {
      const html = await fetchText(this.listingUrl);
      const $ = cheerio.load(html);
      const jobs: RawJob[] = [];

      $(".job-item, .job-card, article").each((_, el) => {
        const title = $(el).find(".job-title, h3, h2").first().text().trim();
        const company = $(el).find(".company-name, .brand-name").first().text().trim() || "Pickdi Brand";
        const link = $(el).find("a[href*='/jobs/'], a[href*='/job/']").first().attr("href") || "";
        const salary = $(el).find(".salary, .budget").first().text().trim() || null;
        const location = $(el).find(".location").first().text().trim() || "Vietnam / Remote";

        if (!title || !link) return;

        const fullUrl = link.startsWith("http") ? link : `https://pickdi.com${link}`;

        jobs.push({
          source: this.key,
          sourceJobId: fullUrl,
          title,
          company,
          description: `${title} by ${company}. Creative video editing role on Pickdi.`,
          location,
          remoteRegion: "Vietnam / Remote",
          isRemote: true,
          employmentType: "Contract / Remote",
          salary,
          skills: ["Video Editing", "Social Video", "Pickdi"],
          sourceUrl: fullUrl,
          applyUrl: fullUrl,
          publishedAt: new Date(),
          rawData: { link: fullUrl, title },
        });
      });

      return jobs;
    } catch (err) {
      console.warn("Pickdi listing warning:", err instanceof Error ? err.message : err);
      return [];
    }
  }
}
