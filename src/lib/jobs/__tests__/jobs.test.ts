import { describe, expect, it, vi } from "vitest";
import { dedupeJobs } from "../dedupe";
import { isRelevantVideoJob } from "../filter";
import { normalizeJob } from "../normalize";
import { JobSyncService } from "../sync";
import type { JobSourceAdapter, JobSyncRepository } from "../types";

const rawJob = {
  source: "remotive" as const,
  sourceJobId: "42",
  title: "  YouTube Video Editor ",
  company: "Acme  Studio",
  description: '<p>Edit <strong>short-form video</strong>.</p><script>bad()</script> Apply: jobs@acme.test',
  location: "Worldwide",
  salary: "$50k - $70k",
  skills: ["Premiere Pro", "Premiere Pro"],
  sourceUrl: "https://example.com/jobs/42?utm_source=test#apply",
};

describe("normalizeJob", () => {
  it("sanitizes, extracts fields and creates stable identifiers", () => {
    const job = normalizeJob(rawJob);
    expect(job.title).toBe("YouTube Video Editor");
    expect(job.description).not.toContain("script");
    expect(job.descriptionText).toContain("Edit short-form video");
    expect(job.contactEmail).toBe("jobs@acme.test");
    expect(job.sourceUrl).toBe("https://example.com/jobs/42");
    expect(job.salaryMin).toBe(50_000);
    expect(job.salaryMax).toBe(70_000);
    expect(job.skills).toEqual(["Premiere Pro"]);
    expect(job.fingerprint).toHaveLength(64);
  });
});

describe("video job filter", () => {
  it("accepts direct titles and contextual descriptions", () => {
    expect(isRelevantVideoJob(normalizeJob(rawJob))).toBe(true);
    expect(isRelevantVideoJob({ title: "Content Creator", descriptionText: "Editing reels and video in Premiere", skills: [] })).toBe(true);
  });

  it("rejects unrelated jobs", () => {
    expect(isRelevantVideoJob({ title: "Backend Engineer", descriptionText: "Build APIs with Go", skills: ["Go"] })).toBe(false);
  });
});

describe("dedupeJobs", () => {
  it("deduplicates by source id, URL, then fingerprint", () => {
    const first = normalizeJob(rawJob);
    const sameFingerprint = normalizeJob({ ...rawJob, source: "remoteok", sourceJobId: "other", sourceUrl: "https://other.test/job" });
    const result = dedupeJobs([first, { ...first }, sameFingerprint]);
    expect(result.jobs).toHaveLength(1);
    expect(result.duplicateCount).toBe(2);
  });
});

describe("JobSyncService", () => {
  it("normalizes, filters, deduplicates and records stats", async () => {
    const adapter: JobSourceAdapter = {
      key: "remotive",
      fetchJobs: vi.fn().mockResolvedValue([
        rawJob,
        { ...rawJob },
        { ...rawJob, sourceJobId: "99", title: "Backend Engineer", description: "Build APIs with Go", skills: ["Go"], sourceUrl: "https://example.com/jobs/99" },
      ]),
    };
    const repository: JobSyncRepository = {
      startRun: vi.fn().mockResolvedValue("run-1"),
      upsertJob: vi.fn().mockResolvedValue("created"),
      markSourceSucceeded: vi.fn().mockResolvedValue(undefined),
      markSourceFailed: vi.fn().mockResolvedValue(undefined),
      finishRun: vi.fn().mockResolvedValue(undefined),
    };

    const result = await new JobSyncService(repository).sync(adapter);
    expect(result).toMatchObject({ fetched: 3, accepted: 1, created: 1, skipped: 2, errors: 0 });
    expect(repository.upsertJob).toHaveBeenCalledTimes(1);
    expect(repository.finishRun).toHaveBeenCalledWith("run-1", expect.objectContaining({ accepted: 1 }), undefined);
  });

  it("records a failed source run", async () => {
    const error = new Error("upstream unavailable");
    const adapter: JobSourceAdapter = { key: "arbeitnow", fetchJobs: vi.fn().mockRejectedValue(error) };
    const repository: JobSyncRepository = {
      startRun: vi.fn().mockResolvedValue("run-2"),
      upsertJob: vi.fn(),
      markSourceSucceeded: vi.fn(),
      markSourceFailed: vi.fn().mockResolvedValue(undefined),
      finishRun: vi.fn().mockResolvedValue(undefined),
    };

    await expect(new JobSyncService(repository).sync(adapter)).rejects.toThrow("upstream unavailable");
    expect(repository.markSourceFailed).toHaveBeenCalledWith("arbeitnow", "upstream unavailable");
    expect(repository.finishRun).toHaveBeenCalledWith("run-2", expect.objectContaining({ errors: 1 }), "upstream unavailable");
  });
});
