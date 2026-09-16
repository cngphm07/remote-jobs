import * as cheerio from "cheerio";
import type { JobSourceAdapter, RawJob } from "../types";
import { fetchText } from "./http";

export class UpworkRssAdapter implements JobSourceAdapter {
  readonly key = "upwork_rss" as const;

  constructor(
    private readonly customFeedUrl = process.env.UPWORK_FEED_URL,
  ) {}

  private getEndpoints(): string[] {
    if (this.customFeedUrl) {
      return [this.customFeedUrl];
    }
    return [
      "https://www.upwork.com/ab/feed/jobs/rss?q=video+editor&sort=recency",
      "https://www.upwork.com/ab/feed/jobs/rss?q=motion+graphics&sort=recency",
    ];
  }

  async fetchJobs(): Promise<RawJob[]> {
    const allJobs: RawJob[] = [];
    const endpoints = this.getEndpoints();

    for (const endpoint of endpoints) {
      try {
        const xml = await fetchText(endpoint, {
          accept: "application/rss+xml, application/xml, text/xml",
          timeoutMs: 8000,
          retries: 1,
        });

        if (!xml || xml.includes("Cloudflare") || xml.includes("Access Denied")) {
          continue;
        }

        const $ = cheerio.load(xml, { xmlMode: true });

        $("item").each((_, item) => {
          const title = $(item).find("title").text().trim().replace(/ - Upwork$/i, "");
          const link = $(item).find("link").text().trim();
          const guid = $(item).find("guid").text().trim();
          const description = $(item).find("description").text().trim();
          const pubDate = $(item).find("pubDate").text().trim();

          if (!title || !link) return;

          // Extract budget or hourly range from description text
          const $desc = cheerio.load(description);
          const fullText = $desc.text();
          let salary: string | null = null;
          const budgetMatch = fullText.match(/Budget:\s*(\$[\d,]+)/i);
          const hourlyMatch = fullText.match(/Hourly Range:\s*(\$[\d,.]+\s*-\s*\$[\d,.]+)/i);
          if (budgetMatch) {
            salary = budgetMatch[1];
          } else if (hourlyMatch) {
            salary = `${hourlyMatch[1]} / hr`;
          }

          // Extract skills
          const skillsMatch = fullText.match(/Skills:\s*([^\n\r<]+)/i);
          const skills = skillsMatch
            ? skillsMatch[1].split(",").map((s) => s.trim()).filter(Boolean)
            : ["Video Editing", "Freelance"];

          allJobs.push({
            source: this.key,
            sourceJobId: guid || link,
            title,
            company: "Upwork Client",
            description,
            location: "Worldwide",
            remoteRegion: "Worldwide",
            isRemote: true,
            employmentType: "Freelance",
            salary,
            skills,
            sourceUrl: link,
            applyUrl: link,
            publishedAt: pubDate ? new Date(pubDate) : null,
            rawData: { guid, link, title, pubDate },
          });
        });
      } catch (err) {
        // Soft catch: Upwork public RSS may return 403 or 410 without custom auth token
        console.warn(`Upwork feed note for ${endpoint}:`, err instanceof Error ? err.message : err);
      }
    }

    return allJobs;
  }
}
