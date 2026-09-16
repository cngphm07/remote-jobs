"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";

export interface JobItem {
  id?: string;
  company: string;
  title: string;
  location: string;
  time: string;
  source: string;
  sourceKey: string;
  salary: string;
  skills: string;
  sourceUrl: string;
}

const INITIAL_JOBS: JobItem[] = [
  {
    company: "The Frameless (Pickdi)",
    title: "Remote Video Editor — Social Ads & Short-form Content",
    location: "Vietnam · Remote",
    time: "30m ago",
    source: "Pickdi",
    sourceKey: "pickdi",
    salary: "~25.000.000 ₫ / mo",
    skills: "Premiere Pro · CapCut · Social Ads · Pacing · Reels",
    sourceUrl: "https://vn.linkedin.com/jobs/view/remote-video-editor-edit-video-cho-qu%E1%BA%A3ng-c%C3%A1o-social-~25m-brand-the-frameless-at-pickdi-4419156678",
  },
  {
    company: "Studio AIM (Pickdi)",
    title: "Remote AI Video Editor & Content Creator",
    location: "Vietnam · Remote",
    time: "45m ago",
    source: "Pickdi",
    sourceKey: "pickdi",
    salary: "~17.000.000 ₫ / mo",
    skills: "AI Video · Premiere Pro · Runway · Midjourney · CapCut",
    sourceUrl: "https://vn.linkedin.com/jobs/view/remote-video-editor-ai-~17m-brand-studio-aim-at-pickdi-4383516231",
  },
  {
    company: "Jobs AI",
    title: "Video Editor & AI Workflow Specialist (Remote)",
    location: "Worldwide · Remote",
    time: "1h ago",
    source: "LinkedIn",
    sourceKey: "linkedin",
    salary: "$2,800 – $3,800 / mo",
    skills: "Premiere Pro · After Effects · AI Video · English",
    sourceUrl: "https://vn.linkedin.com/jobs/view/video-editor-remote-at-jobs-ai-4409565920",
  },
  {
    company: "AX Creative Agency",
    title: "Senior Video Editor & Post-Production Lead",
    location: "Ho Chi Minh City · Hybrid / Remote",
    time: "1.5h ago",
    source: "LinkedIn",
    sourceKey: "linkedin",
    salary: "$1,500 – $2,200 / mo",
    skills: "Premiere Pro · DaVinci Resolve · Commercial TVC · Color",
    sourceUrl: "https://vn.linkedin.com/jobs/view/senior-video-editor-at-ax-creative-agency-3689598680",
  },
  {
    company: "NIA Production",
    title: "Commercial & Music Video Post-Production Artist",
    location: "Vietnam · Remote",
    time: "2h ago",
    source: "LinkedIn",
    sourceKey: "linkedin",
    salary: "$1,800 – $2,600 / mo",
    skills: "DaVinci Resolve · After Effects · Music Video · Grading",
    sourceUrl: "https://www.linkedin.com/company/nia-production",
  },
  {
    company: "Real Estate Media Group",
    title: "Real Estate & Event Video Editor (DaVinci Resolve)",
    location: "US Client · Remote",
    time: "2h ago",
    source: "Upwork",
    sourceKey: "upwork",
    salary: "$35 – $50 / hr",
    skills: "DaVinci Resolve · Color Grading · Real Estate · Sound Design",
    sourceUrl: "https://www.upwork.com/freelance-jobs/apply/Remote-Video-Editor-Real-Estate-Event-Videos-DaVinci-Resolve_~022098529594570812237/",
  },
  {
    company: "Global Luxury Agency",
    title: "High-Skilled Real Estate Video Editor (Final Cut Pro / Premiere)",
    location: "US / Worldwide · Remote",
    time: "2.5h ago",
    source: "Upwork",
    sourceKey: "upwork",
    salary: "$40 – $65 / hr",
    skills: "Final Cut Pro · Premiere Pro · 4K Drone Footage · Color",
    sourceUrl: "https://www.upwork.com/freelance-jobs/apply/High-Skilled-Real-Estate-Video-Editor-Final-Cut-Pro_~022090948242158982500/",
  },
  {
    company: "Activate Talent",
    title: "Remote Video Editor (Vietnam & Global Creative Team)",
    location: "Vietnam · Remote",
    time: "3h ago",
    source: "Workable",
    sourceKey: "workable",
    salary: "$1,800 – $2,500 / mo",
    skills: "Motion Graphics · Commercial TVC · Storytelling",
    sourceUrl: "https://jobs.workable.com/view/wA9PJFJmKNVQCzwURShhPE/remote-video-editor-in-vietnam-at-activate-talent",
  },
  {
    company: "Spiralyze",
    title: "Video Editor — LinkedIn & B2B Growth Content",
    location: "Worldwide · Remote",
    time: "4h ago",
    source: "Himalayas",
    sourceKey: "himalayas",
    salary: "$2,500 – $3,500 / mo",
    skills: "After Effects · Motion Design · B2B Narrative · Typography",
    sourceUrl: "https://himalayas.app/companies/spiralyze/jobs/video-editor-linkedin-content-5938063696",
  },
  {
    company: "Studio Ten Australia",
    title: "Full-time Real Estate & YouTube Video Editor",
    location: "Australia / APAC · Remote",
    time: "5h ago",
    source: "OnlineJobs.ph",
    sourceKey: "onlinejobs",
    salary: "$1,600 – $2,200 / mo",
    skills: "Premiere Pro · Final Cut · Real Estate · Color Grade",
    sourceUrl: "https://www.onlinejobs.ph/jobseekers/job/full-time-real-estate-video-editor-1729783",
  },
  {
    company: "Northstar Media",
    title: "Short-form Video Editor (TikTok, Reels & YouTube Shorts)",
    location: "Worldwide · Remote",
    time: "6h ago",
    source: "Remotive",
    sourceKey: "remotive",
    salary: "$2,500 – $3,500 / mo",
    skills: "Premiere Pro · CapCut · Pacing · Sound Effects · Subtitles",
    sourceUrl: "https://remotive.com",
  },
  {
    company: "Frame.io Creator Studio",
    title: "Senior YouTube Long-form Video Editor & Storyteller",
    location: "US / EU Overlap · Remote",
    time: "7h ago",
    source: "Remote OK",
    sourceKey: "remoteok",
    salary: "$55,000 – $72,000 / yr",
    skills: "YouTube · After Effects · Storytelling · Retention Editing",
    sourceUrl: "https://remoteok.com",
  },
  {
    company: "Lumen Creative Studio",
    title: "Motion Graphics Designer & 2D/3D Animator",
    location: "Anywhere · Freelance",
    time: "8h ago",
    source: "Arbeitnow",
    sourceKey: "arbeitnow",
    salary: "$35 – $50 / hr",
    skills: "Motion Graphics · Cinema 4D · After Effects · 2D/3D",
    sourceUrl: "https://www.arbeitnow.com",
  },
];

const SOURCES = [
  { key: "all", label: "TẤT CẢ" },
  { key: "pickdi", label: "PICKDI" },
  { key: "linkedin", label: "LINKEDIN" },
  { key: "upwork", label: "UPWORK" },
  { key: "workable", label: "WORKABLE" },
  { key: "himalayas", label: "HIMALAYAS" },
  { key: "onlinejobs", label: "ONLINEJOBS" },
  { key: "remotive", label: "REMOTIVE" },
  { key: "remoteok", label: "REMOTE OK" },
  { key: "arbeitnow", label: "ARBEITNOW" },
];

export function InteractiveJobs() {
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredJobs = useMemo(() => {
    return INITIAL_JOBS.filter((job) => {
      // Source filter
      if (selectedSource !== "all" && job.sourceKey !== selectedSource) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesSkills = job.skills.toLowerCase().includes(q);
        const matchesLocation = job.location.toLowerCase().includes(q);
        const matchesSalary = job.salary.toLowerCase().includes(q);
        return matchesTitle || matchesCompany || matchesSkills || matchesLocation || matchesSalary;
      }
      return true;
    });
  }, [selectedSource, searchQuery]);

  // Dynamic counts per source
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = { all: INITIAL_JOBS.length };
    for (const job of INITIAL_JOBS) {
      counts[job.sourceKey] = (counts[job.sourceKey] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <>
      {/* Search Bar */}
      <div className="mb-7 flex max-w-2xl items-center border border-[var(--line)] bg-[var(--surface)] p-3 transition-colors focus-within:border-[var(--line2)]">
        <Search className="ml-2 hidden shrink-0 text-[var(--g3)] sm:block" size={17} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-0 min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-[.9rem] font-light text-[var(--ink)] outline-none placeholder:text-[var(--g3)]"
          placeholder="Lọc theo kỹ năng (Premiere, DaVinci, AE, AI, Short-form) hoặc công ty..."
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="mono mr-2 text-[.56rem] text-[var(--g2)] hover:text-[var(--ink)]"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Filter Pills Bar */}
      <div className="mb-10 flex flex-wrap gap-x-2 gap-y-3 border-b border-[var(--line)] pb-6">
        {SOURCES.map((src) => {
          const isActive = selectedSource === src.key;
          const count = sourceCounts[src.key] || 0;
          return (
            <button
              key={src.key}
              type="button"
              onClick={() => setSelectedSource(src.key)}
              className={`filter-btn ${isActive ? "active" : ""}`}
              style={{ userSelect: "none" }}
            >
              {src.label} {count > 0 && <span className="count mono">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Editorial Job List */}
      <div className="flex flex-col border-t border-[var(--line)]">
        {filteredJobs.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mono text-[.66rem] text-[var(--g2)]" style={{ letterSpacing: ".24em" }}>
              KHÔNG TÌM THẤY CÔNG VIỆC PHÙ HỢP
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedSource("all");
                setSearchQuery("");
              }}
              className="filter-btn active mt-4 text-[.56rem]"
            >
              XÓA BỘ LỌC
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <article
              key={job.title + job.sourceKey}
              className="group flex flex-col justify-between gap-5 border-b border-[var(--line)] px-1 py-8 transition-colors hover:bg-white/[0.015] md:flex-row md:items-center md:px-4 md:py-9"
            >
              {/* Left column: Meta, Title & Skills */}
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3">
                  <span className="mono text-[.56rem] text-[var(--g1)]" style={{ letterSpacing: ".2em" }}>
                    {job.company}
                  </span>
                  <span className="text-[.6rem] text-[var(--g3)]">/</span>
                  <span className="mono text-[.54rem] text-[var(--accent)]" style={{ letterSpacing: ".18em" }}>
                    {job.source.toUpperCase()}
                  </span>
                  <span className="text-[.6rem] text-[var(--g3)]">/</span>
                  <span className="mono text-[.52rem] text-[var(--g3)]" style={{ letterSpacing: ".14em" }}>
                    {job.time}
                  </span>
                </div>

                <h3 className="mt-3.5 text-[1.12rem] font-normal leading-snug text-[var(--ink)] transition-colors group-hover:text-white md:text-[1.25rem]">
                  {job.title}
                </h3>

                <p className="mono mt-3 text-[.64rem] text-[var(--g2)]" style={{ letterSpacing: ".08em" }}>
                  {job.skills}
                </p>
              </div>

              {/* Right column: Salary, Location & Apply button */}
              <div className="flex items-center justify-between gap-6 border-t border-[var(--line)] pt-3 md:flex-col md:items-end md:border-t-0 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="mono text-[.88rem] font-medium text-[var(--ink)]" style={{ letterSpacing: ".02em" }}>
                    {job.salary}
                  </p>
                  <p className="mono mt-1 text-[.52rem] text-[var(--g2)]" style={{ letterSpacing: ".16em" }}>
                    {job.location}
                  </p>
                </div>

                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Mở bài đăng tuyển dụng"
                  className="inline-flex items-center gap-1.5 border border-[var(--line)] px-3 py-1.5 text-[.56rem] font-mono text-[var(--g1)] transition-all group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
                  style={{ letterSpacing: ".16em" }}
                >
                  APPLY <ArrowUpRight size={13} />
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
