import * as cheerio from "cheerio";
import { fetchText } from "./adapters/http";
import { normalizeJob } from "./normalize";
import type { NormalizedJob, RawJob, JobSourceKey } from "./types";

export interface ParsedJobResult {
  raw: RawJob;
  normalized: NormalizedJob;
}

function detectSourceKey(url: string): JobSourceKey {
  const lower = url.toLowerCase();
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("upwork.com")) return "upwork_rss";
  if (lower.includes("himalayas.app")) return "himalayas";
  if (lower.includes("workable.com")) return "workable";
  if (lower.includes("pickdi.com")) return "pickdi";
  if (lower.includes("onlinejobs.ph")) return "onlinejobs_ph";
  if (lower.includes("remotive.com")) return "remotive";
  if (lower.includes("remoteok.com")) return "remoteok";
  if (lower.includes("arbeitnow.com")) return "arbeitnow";
  return "manual";
}

export async function parseJobUrl(targetUrl: string): Promise<ParsedJobResult> {
  const cleanUrl = targetUrl.trim();
  const sourceKey = detectSourceKey(cleanUrl);

  const html = await fetchText(cleanUrl, {
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 RemoteCut/1.0",
  });

  const $ = cheerio.load(html);

  let title = "";
  let company = "";
  let description = "";
  let salary: string | null = null;
  let location = "Remote / Worldwide";
  let publishedAt: Date | null = null;
  let employmentType: string | null = null;
  const skills: string[] = [];

  // TIER 1: Check JSON-LD Schema
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const rawText = $(el).html();
      if (!rawText) return;
      const data = JSON.parse(rawText);
      const items = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];

      for (const item of items) {
        if (item["@type"] === "JobPosting" || item["@type"]?.includes?.("JobPosting")) {
          if (item.title && !title) title = String(item.title).trim();
          if (item.hiringOrganization?.name && !company) company = String(item.hiringOrganization.name).trim();
          if (item.description && !description) description = String(item.description).trim();
          if (item.datePosted && !publishedAt) publishedAt = new Date(item.datePosted);
          if (item.employmentType && !employmentType) employmentType = String(item.employmentType);

          if (item.baseSalary?.value) {
            const val = item.baseSalary.value;
            const cur = item.baseSalary.currency || "$";
            if (typeof val === "object") {
              salary = `${cur}${val.minValue ?? ""} - ${cur}${val.maxValue ?? ""}`;
            } else {
              salary = `${cur}${val}`;
            }
          }

          if (item.jobLocation?.address) {
            const addr = item.jobLocation.address;
            if (typeof addr === "string") location = addr;
            else if (typeof addr === "object") {
              location = [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean).join(", ") || "Remote";
            }
          }
        }
      }
    } catch {
      // Ignore JSON parse errors in individual script tags
    }
  });

  // TIER 2: OpenGraph & Meta Tags
  if (!title) {
    title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text().trim() ||
      "";
    // Clean common site title suffixes
    title = title.replace(/\s*([|–—·-]\s*.*)$/i, "").trim();
  }

  if (!company) {
    company =
      $('meta[property="og:site_name"]').attr("content") ||
      $('meta[name="author"]').attr("content") ||
      "";
    // Extract from title if pattern: "Job Title at Company"
    const atMatch = title.match(/at\s+([A-Za-z0-9\s.,&'-]+)$/i);
    if (atMatch && !company) {
      company = atMatch[1].trim();
    }
  }

  if (!description) {
    description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";
  }

  // TIER 3: DOM Heuristic Fallback
  if (!title) {
    title = $("h1").first().text().trim() || $("h2").first().text().trim() || "Remote Video Editor";
  }

  if (!company) {
    company =
      $(".company-name, [data-company], .employer-name, .sub-title, .job-company")
        .first()
        .text()
        .trim() || "Direct Employer";
  }

  if (!description || description.length < 50) {
    const mainContent = $(
      "article, .job-description, .description, #job-details, main, .content",
    )
      .first()
      .text()
      .trim();
    if (mainContent) description = mainContent.slice(0, 5000);
  }

  // Extract skills from text
  const lowerText = `${title} ${description}`.toLowerCase();
  if (lowerText.includes("premiere")) skills.push("Premiere Pro");
  if (lowerText.includes("after effects")) skills.push("After Effects");
  if (lowerText.includes("davinci") || lowerText.includes("resolve")) skills.push("DaVinci Resolve");
  if (lowerText.includes("final cut")) skills.push("Final Cut Pro");
  if (lowerText.includes("capcut")) skills.push("CapCut");
  if (lowerText.includes("tiktok") || lowerText.includes("reels") || lowerText.includes("short-form")) skills.push("Short-form");
  if (lowerText.includes("youtube")) skills.push("YouTube");
  if (lowerText.includes("motion graphics")) skills.push("Motion Graphics");
  if (lowerText.includes("color grad")) skills.push("Color Grading");
  if (skills.length === 0) skills.push("Video Editing");

  const raw: RawJob = {
    source: sourceKey,
    sourceJobId: cleanUrl,
    title: title || "Remote Video Editor",
    company: company || "Direct Employer",
    description: description || `Job opportunity at ${cleanUrl}`,
    location,
    remoteRegion: location.toLowerCase().includes("vietnam") ? "Vietnam / APAC" : "Worldwide",
    isRemote: true,
    employmentType: employmentType || "Remote / Full-time",
    salary,
    skills,
    sourceUrl: cleanUrl,
    applyUrl: cleanUrl,
    publishedAt: publishedAt || new Date(),
    rawData: { url: cleanUrl, parsedAt: new Date().toISOString() },
  };

  const normalized = normalizeJob(raw);

  return { raw, normalized };
}
