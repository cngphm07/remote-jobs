import { createHash } from "node:crypto";
import sanitizeHtml from "sanitize-html";
import type { NormalizedJob, RawJob } from "./types";

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const MONEY_PATTERN = /(?:([$€£])\s*)?(\d[\d,.]*)(?:\s*[kK])?(?:\s*[-–—]\s*(?:[$€£]\s*)?(\d[\d,.]*)(\s*[kK])?)?/;

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeKey(value: string): string {
  return normalizeWhitespace(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function htmlToText(html: string): string {
  return normalizeWhitespace(
    sanitizeHtml(html, {
      allowedTags: [],
      allowedAttributes: {},
    }),
  );
}

function cleanHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.filter((tag) => !["img"].includes(tag)),
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
  }).trim();
}

function parseDate(value: RawJob["publishedAt"]): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("utm_") || ["ref", "source"].includes(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return null;
  }
}

function parseSalary(value?: string | null): Pick<NormalizedJob, "salaryMin" | "salaryMax" | "salaryCurrency"> {
  const match = value?.match(MONEY_PATTERN);
  if (!match) return { salaryMin: null, salaryMax: null, salaryCurrency: null };
  const multiplier = /k/i.test(match[0]) ? 1_000 : 1;
  const number = (part?: string) => part ? Math.round(Number(part.replace(/,/g, "")) * multiplier) : null;
  const currency = match[1] === "$" ? "USD" : match[1] === "€" ? "EUR" : match[1] === "£" ? "GBP" : null;
  return { salaryMin: number(match[2]), salaryMax: number(match[3]), salaryCurrency: currency };
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeJob(raw: RawJob): NormalizedJob {
  const title = normalizeWhitespace(raw.title);
  const company = normalizeWhitespace(raw.company || "Unknown company");
  const description = cleanHtml(raw.description ?? "");
  const descriptionText = htmlToText(description);
  const location = raw.location ? normalizeWhitespace(raw.location) : null;
  const sourceUrl = normalizeUrl(raw.sourceUrl);
  if (!title || !sourceUrl) throw new Error("Job requires a title and a valid source URL");

  const applyUrl = normalizeUrl(raw.applyUrl) ?? sourceUrl;
  const contactEmail = raw.contactEmail?.match(EMAIL_PATTERN)?.[0]?.toLowerCase()
    ?? descriptionText.match(EMAIL_PATTERN)?.[0]?.toLowerCase()
    ?? null;
  const normalizedCompany = normalizeKey(company);
  const fingerprint = hash([normalizeKey(title), normalizedCompany, normalizeKey(location ?? "remote")].join("|"));
  const skills = [...new Set((raw.skills ?? []).map(normalizeWhitespace).filter(Boolean))];

  return {
    source: raw.source,
    sourceJobId: raw.sourceJobId ? String(raw.sourceJobId) : null,
    title,
    company,
    normalizedCompany,
    description,
    descriptionText,
    location,
    country: raw.country ? normalizeWhitespace(raw.country) : null,
    remoteRegion: raw.remoteRegion ? normalizeWhitespace(raw.remoteRegion) : null,
    isRemote: raw.isRemote ?? /remote|worldwide|anywhere|home/i.test(`${location ?? ""} ${raw.remoteRegion ?? ""}`),
    employmentType: raw.employmentType ? normalizeWhitespace(raw.employmentType) : null,
    ...parseSalary(raw.salary),
    skills,
    sourceUrl,
    applyUrl,
    contactEmail,
    publishedAt: parseDate(raw.publishedAt),
    expiresAt: parseDate(raw.expiresAt),
    contentHash: hash([title, company, descriptionText, location ?? "", applyUrl].join("|")),
    fingerprint,
    rawData: raw.rawData,
  };
}
