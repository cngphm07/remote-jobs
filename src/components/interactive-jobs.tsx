"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";

export interface JobItem {
  id: string;
  company: string;
  title: string;
  location: string | null;
  time: string;
  source: string;
  sourceKey: string;
  salary: string | null;
  skills: string;
  sourceUrl: string;
}

type InteractiveJobsProps = {
  jobs: JobItem[];
};

function formatSource(source: string) {
  return source.replace("OnlineJobs.ph", "OnlineJobs").replace("Remote OK", "Remote OK");
}

export function InteractiveJobs({ jobs }: InteractiveJobsProps) {
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sources = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    jobs.forEach((job) => {
      const current = counts.get(job.sourceKey);
      counts.set(job.sourceKey, {
        label: formatSource(job.source),
        count: (current?.count || 0) + 1,
      });
    });
    return [
      { key: "all", label: "TẤT CẢ", count: jobs.length },
      ...Array.from(counts.entries())
        .sort(([, a], [, b]) => a.label.localeCompare(b.label))
        .map(([key, value]) => ({ key, ...value })),
    ];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (selectedSource !== "all" && job.sourceKey !== selectedSource) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return [job.title, job.company, job.skills, job.location || "", job.salary || "", job.source]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [jobs, selectedSource, searchQuery]);

  if (jobs.length === 0) {
    return (
      <div className="border-y border-[var(--line)] py-16 text-center">
        <p className="mono text-[.66rem] text-[var(--g2)]" style={{ letterSpacing: ".24em" }}>
          CHƯA CÓ JOB CÒN HIỆU LỰC
        </p>
        <p className="mx-auto mt-4 max-w-md text-[.9rem] font-light leading-relaxed text-[var(--g2)]">
          Hệ thống chỉ hiển thị tin tuyển dụng chưa hết hạn và được xác thực trong 7 ngày gần nhất. Lượt đồng bộ tiếp theo sẽ tự động cập nhật dữ liệu mới.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-7 flex max-w-2xl items-center border border-[var(--line)] bg-[var(--surface)] p-3 transition-colors focus-within:border-[var(--line2)]">
        <Search className="ml-2 hidden shrink-0 text-[var(--g3)] sm:block" size={17} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-0 min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-[.9rem] font-light text-[var(--ink)] outline-none placeholder:text-[var(--g3)]"
          placeholder="Lọc theo kỹ năng, công ty hoặc nguồn..."
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="mono mr-2 text-[.56rem] text-[var(--g2)] hover:text-[var(--ink)]">
            CLEAR
          </button>
        )}
      </div>

      <div className="mb-10 flex flex-wrap gap-x-2 gap-y-3 border-b border-[var(--line)] pb-6">
        {sources.map((source) => (
          <button
            key={source.key}
            type="button"
            onClick={() => setSelectedSource(source.key)}
            className={`filter-btn ${selectedSource === source.key ? "active" : ""}`}
          >
            {source.label} <span className="count mono">{source.count}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col border-t border-[var(--line)]">
        {filteredJobs.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mono text-[.66rem] text-[var(--g2)]" style={{ letterSpacing: ".24em" }}>
              KHÔNG TÌM THẤY JOB PHÙ HỢP
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
              key={job.id}
              className="group flex flex-col justify-between gap-5 border-b border-[var(--line)] px-1 py-8 transition-colors hover:bg-white/[0.015] md:flex-row md:items-center md:px-4 md:py-9"
            >
              <div className="flex-1 pr-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="mono text-[.56rem] text-[var(--g1)]" style={{ letterSpacing: ".2em" }}>{job.company}</span>
                  <span className="text-[.6rem] text-[var(--g3)]">/</span>
                  <span className="mono text-[.54rem] text-[var(--accent)]" style={{ letterSpacing: ".18em" }}>{job.source.toUpperCase()}</span>
                  <span className="text-[.6rem] text-[var(--g3)]">/</span>
                  <span className="mono text-[.52rem] text-[var(--g3)]" style={{ letterSpacing: ".14em" }}>{job.time}</span>
                </div>
                <h3 className="mt-3.5 text-[1.12rem] font-normal leading-snug text-[var(--ink)] transition-colors group-hover:text-white md:text-[1.25rem]">{job.title}</h3>
                {job.skills && <p className="mono mt-3 text-[.64rem] text-[var(--g2)]" style={{ letterSpacing: ".08em" }}>{job.skills}</p>}
              </div>

              <div className="flex items-center justify-between gap-6 border-t border-[var(--line)] pt-3 md:flex-col md:items-end md:border-t-0 md:pt-0">
                <div className="text-left md:text-right">
                  {job.salary && <p className="mono text-[.88rem] font-medium text-[var(--ink)]" style={{ letterSpacing: ".02em" }}>{job.salary}</p>}
                  {job.location && <p className="mono mt-1 text-[.52rem] text-[var(--g2)]" style={{ letterSpacing: ".16em" }}>{job.location}</p>}
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
