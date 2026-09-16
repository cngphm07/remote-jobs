import { ArrowUpRight, Link2, Search, Sparkles } from "lucide-react";
import { AuthButton } from "@/components/auth-button";

const sampleJobs = [
  {
    company: "The Frameless (Pickdi)",
    title: "Remote Video Editor (Edit Video Quảng Cáo Social & Reels)",
    location: "Vietnam · Remote",
    time: "30 phút trước",
    source: "Pickdi",
    salary: "~25.000.000 ₫ / tháng",
    tags: ["Premiere Pro", "CapCut", "Social Ads", "Pacing", "Short-form"],
    sourceUrl: "https://pickdi.com",
  },
  {
    company: "Jobs AI (LinkedIn)",
    title: "Remote Video Editor (AI Video & Social Content)",
    location: "Worldwide · Remote",
    time: "1 giờ trước",
    source: "LinkedIn",
    salary: "$2,800 – $3,800 / tháng",
    tags: ["Premiere Pro", "After Effects", "AI Video", "English"],
    sourceUrl: "https://vn.linkedin.com",
  },
  {
    company: "Real Estate Media (Upwork)",
    title: "Real Estate & Event Video Editor (DaVinci Resolve)",
    location: "US Client · Remote",
    time: "2 giờ trước",
    source: "Upwork",
    salary: "$35 – $50 / giờ",
    tags: ["DaVinci Resolve", "Color Grading", "Real Estate", "Sound Design"],
    sourceUrl: "https://www.upwork.com",
  },
  {
    company: "Activate Talent (Workable)",
    title: "Remote Video Editor (Vietnam & Global Creative Team)",
    location: "Vietnam · Remote",
    time: "3 giờ trước",
    source: "Workable",
    salary: "$1,800 – $2,500 / tháng",
    tags: ["Video Editing", "Motion Graphics", "Commercial", "Storytelling"],
    sourceUrl: "https://jobs.workable.com",
  },
  {
    company: "Spiralyze (Himalayas)",
    title: "Video Editor (LinkedIn & B2B Growth Content)",
    location: "Worldwide · Remote",
    time: "4 giờ trước",
    source: "Himalayas",
    salary: "$2,500 – $3,500 / tháng",
    tags: ["B2B Video", "Motion Design", "After Effects", "English"],
    sourceUrl: "https://himalayas.app",
  },
  {
    company: "Australian Studio (OnlineJobs)",
    title: "Full-time Real Estate & YouTube Video Editor",
    location: "Australia / APAC · Remote",
    time: "5 giờ trước",
    source: "OnlineJobs.ph",
    salary: "$1,600 – $2,200 / tháng",
    tags: ["Premiere Pro", "Final Cut Pro", "YouTube", "Color Grade"],
    sourceUrl: "https://www.onlinejobs.ph",
  },
];

const pipeline = [
  { label: "SAVED", count: 18, desc: "Việc đã lưu", accent: false },
  { label: "PREPARING", count: 6, desc: "Đang soạn email", accent: false },
  { label: "APPLIED", count: 12, desc: "Đã gửi hồ sơ", accent: true },
  { label: "REPLIED", count: 5, desc: "Recruiter phản hồi", accent: false },
  { label: "INTERVIEW", count: 3, desc: "Lịch phỏng vấn", accent: false },
];

export default function Home() {
  return (
    <>
      {/* film grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* header */}
      <header className="site-header">
        <a className="logo display" href="#top">
          REMOTE<em>CUT</em>
        </a>
        <nav className="mono">
          <a href="#pipeline">Pipeline</a>
          <a href="#jobs">Jobs</a>
          <a href="#import">Import</a>
          <a href="#assistant">Assistant</a>
          <a href="#system">System</a>
        </nav>
        <div className="flex items-center gap-4">
          <p className="tc mono hidden md:block" aria-hidden="true">
            SYNC: 3H · 9 SOURCES
          </p>
          <AuthButton />
        </div>
      </header>

      {/* hero */}
      <section className="hero-wrap" id="top">
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-frame" aria-hidden="true">
          <span className="hf hf-tl" />
          <span className="hf hf-tr" />
          <span className="hf hf-bl" />
          <span className="hf hf-br" />
          <span className="hero-side mono">REMOTECUT — AUTO SYNC</span>
          <span className="hero-side-r mono">EVERY 3 HOURS · GLOBAL</span>
        </div>

        <div className="relative z-[3]">
          <p className="hero-kicker mono">
            <Sparkles size={11} className="mr-2 inline-block text-[var(--accent)]" />
            AUTO CURATED EVERY 3 HOURS — WORLDWIDE 2026
          </p>

          <h1 className="hero-title display">
            REMOTE VIDEO EDITOR<br />
            <span className="amp">&amp;</span> POST-PRODUCTION
          </h1>

          <p className="hero-desc">
            Hệ thống tự động tìm kiếm, chuẩn hóa và tổng hợp việc làm <b>Video Editor Remote</b> từ <b>LinkedIn, Upwork, Pickdi, Workable, Himalayas, OnlineJobs.ph, Remotive, Remote OK, Arbeitnow</b>. Tự động đồng bộ mỗi 3 giờ, hỗ trợ AI soạn thảo email ứng tuyển và liên kết 2 chiều với Gmail.
          </p>

          {/* search box */}
          <div className="mt-8 flex max-w-2xl items-center border border-[var(--line)] bg-[var(--surface)] p-2 transition-colors focus-within:border-[var(--line2)]">
            <Search className="ml-2 hidden shrink-0 text-[var(--g3)] sm:block" size={18} />
            <input
              className="w-0 min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-[.92rem] font-light text-[var(--ink)] outline-none placeholder:text-[var(--g3)]"
              placeholder="Tìm theo kỹ năng (Premiere, DaVinci, AE, CapCut) hoặc công ty..."
            />
            <button className="filter-btn active shrink-0">TÌM JOB</button>
          </div>

          {/* hero meta */}
          <div className="hero-meta mono">
            <div>
              <b className="display text-[var(--ink)]">380+</b>
              <span>TOTAL ROLES</span>
            </div>
            <div>
              <b className="display text-[var(--ink)]">9</b>
              <span>SOURCES</span>
            </div>
            <div>
              <b className="display text-[var(--accent)]">3H</b>
              <span>SYNC CYCLE</span>
            </div>
            <div>
              <b className="display text-[var(--ink)]">12</b>
              <span>APPLIED</span>
            </div>
            <div>
              <b className="display text-[var(--ink)]">100%</b>
              <span>REMOTE</span>
            </div>
          </div>
        </div>

        <a className="hero-scroll mono" href="#pipeline" aria-label="Scroll to pipeline">
          SCROLL<span className="hs-line" />
        </a>
      </section>

      {/* marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>PICKDI CREATIVE</span>
          <span className="sep">✦</span>
          <span>LINKEDIN JOBS</span>
          <span className="sep">✦</span>
          <span>UPWORK FEED</span>
          <span className="sep">✦</span>
          <span>WORKABLE ROLES</span>
          <span className="sep">✦</span>
          <span>HIMALAYAS REMOTE</span>
          <span className="sep">✦</span>
          <span>ONLINEJOBS.PH</span>
          <span className="sep">✦</span>
          <span>REMOTIVE API</span>
          <span className="sep">✦</span>
          <span>REMOTE OK</span>
          <span className="sep">✦</span>
          <span>ARBEITNOW</span>
          <span className="sep">✦</span>
          <span>PICKDI CREATIVE</span>
          <span className="sep">✦</span>
          <span>LINKEDIN JOBS</span>
          <span className="sep">✦</span>
          <span>UPWORK FEED</span>
          <span className="sep">✦</span>
        </div>
      </div>

      {/* section 01: pipeline */}
      <section id="pipeline" style={{ padding: "clamp(4.5rem, 9vh, 7rem) var(--pad)" }}>
        <div className="sec-head">
          <span className="sec-num mono">01</span>
          <span className="sec-rule" />
          <span className="sec-title mono">APPLICATION PIPELINE</span>
          <span className="sec-count mono">5 STAGES · 44 TOTAL</span>
        </div>

        <div className="grid grid-cols-2 gap-[1.4rem] md:grid-cols-5">
          {pipeline.map((item) => (
            <div key={item.label} className="card-crop p-6">
              <p className="mono text-[.58rem] text-[var(--g2)]" style={{ letterSpacing: ".28em" }}>
                {item.label}
              </p>
              <p
                className={`display mt-5 text-[clamp(2.2rem,3.8vw,3.2rem)] ${
                  item.accent ? "text-[var(--accent)]" : "text-[var(--ink)]"
                }`}
              >
                {item.count}
              </p>
              <p className="mono mt-3 text-[.52rem] text-[var(--g3)]" style={{ letterSpacing: ".2em" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* section 02: curated jobs */}
      <section id="jobs" style={{ padding: "0 var(--pad) clamp(4rem, 8vh, 6rem)" }}>
        <div className="sec-head">
          <span className="sec-num mono">02</span>
          <span className="sec-rule" />
          <span className="sec-title mono">CURATED JOBS (UPDATED EVERY 3H)</span>
          <span className="sec-count mono">9 SOURCES INTEGRATED</span>
        </div>

        {/* filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button className="filter-btn active">
            TẤT CẢ <span className="count mono">384</span>
          </button>
          <button className="filter-btn">
            PICKDI <span className="count mono">18</span>
          </button>
          <button className="filter-btn">
            LINKEDIN <span className="count mono">74</span>
          </button>
          <button className="filter-btn">
            UPWORK <span className="count mono">52</span>
          </button>
          <button className="filter-btn">
            WORKABLE <span className="count mono">26</span>
          </button>
          <button className="filter-btn">
            HIMALAYAS <span className="count mono">38</span>
          </button>
          <button className="filter-btn">
            ONLINEJOBS <span className="count mono">45</span>
          </button>
          <button className="filter-btn">
            REMOTIVE <span className="count mono">59</span>
          </button>
          <button className="filter-btn">REMOTE OK</button>
          <button className="filter-btn">ARBEITNOW</button>
        </div>

        {/* job grid */}
        <div className="grid gap-[1.4rem] md:grid-cols-2">
          {sampleJobs.map((job) => (
            <article key={job.title} className="card-crop group p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="display grid size-10 shrink-0 place-items-center bg-[var(--g3)] text-[.9rem] text-[var(--ink)]">
                    {job.company.slice(0, 1)}
                  </div>
                  <div>
                    <p className="mono text-[.58rem] text-[var(--g1)]" style={{ letterSpacing: ".22em" }}>
                      {job.company}
                    </p>
                    <p className="mono text-[.52rem] text-[var(--accent)]" style={{ letterSpacing: ".18em" }}>
                      VIA {job.source.toUpperCase()}
                    </p>
                  </div>
                </div>
                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Mở chi tiết job"
                  className="grid size-9 shrink-0 place-items-center border border-[var(--line)] text-[var(--g1)] transition-all group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[#000]"
                >
                  <ArrowUpRight size={15} />
                </a>
              </div>

              <h3
                className="mt-5 text-[clamp(1.15rem,1.8vw,1.35rem)] font-normal leading-[1.3] text-[var(--ink)]"
                style={{ letterSpacing: "-.01em" }}
              >
                {job.title}
              </h3>

              <div className="mt-5 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="mono border border-[var(--line)] px-2.5 py-1 text-[.52rem] text-[var(--g1)]"
                    style={{ letterSpacing: ".18em", borderRadius: "99px" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-[var(--line)] pt-4">
                <div>
                  <p className="display text-[1.15rem] text-[var(--ink)]" style={{ letterSpacing: "-.01em" }}>
                    {job.salary}
                  </p>
                  <p className="mono mt-1 text-[.54rem] text-[var(--g2)]" style={{ letterSpacing: ".2em" }}>
                    {job.location}
                  </p>
                </div>
                <p className="mono text-[.54rem] text-[var(--g3)]" style={{ letterSpacing: ".16em" }}>
                  {job.time}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* section 03: quick URL import */}
      <section id="import" style={{ padding: "0 var(--pad) clamp(4rem, 8vh, 6rem)" }}>
        <div className="sec-head">
          <span className="sec-num mono">03</span>
          <span className="sec-rule" />
          <span className="sec-title mono">SMART SINGLE URL IMPORTER</span>
          <span className="sec-count mono">PASTE ANY JOB LINK</span>
        </div>

        <div className="card-crop p-8 md:p-10">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <Link2 size={16} className="text-[var(--accent)]" />
              <span className="mono text-[.58rem] text-[var(--accent)]" style={{ letterSpacing: ".24em" }}>
                HỖ TRỢ LINK TỪ MỌI NỀN TẢNG
              </span>
            </div>
            <h2 className="display text-[clamp(1.4rem,2.5vw,2.2rem)] text-[var(--ink)]">
              Dán link bài tuyển dụng bất kỳ<br />
              để tự động bóc tách <span className="amp">&amp;</span> lưu trữ
            </h2>
            <p className="mt-3 text-[.88rem] font-light leading-relaxed text-[var(--g2)]">
              Tự động phân tích Schema JSON-LD, OpenGraph và bóc tách Tiêu đề, Công ty, Mức lương, Kỹ năng từ link LinkedIn, Upwork, Pickdi, Workable, Indeed, OnlineJobs.ph, Facebook Group...
            </p>

            {/* URL input form */}
            <div className="mt-6 flex items-center border border-[var(--line)] bg-[var(--bg)] p-2 focus-within:border-[var(--line2)]">
              <input
                className="w-0 min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-[.88rem] font-light text-[var(--ink)] outline-none placeholder:text-[var(--g3)]"
                placeholder="https://vn.linkedin.com/jobs/view/... hoặc link Upwork, Pickdi..."
              />
              <button className="filter-btn active shrink-0">BÓC TÁCH &amp; LƯU</button>
            </div>
          </div>
        </div>
      </section>

      {/* section 04: email assistant */}
      <section id="assistant" style={{ padding: "0 var(--pad) clamp(4rem, 8vh, 6rem)" }}>
        <div className="sec-head">
          <span className="sec-num mono">04</span>
          <span className="sec-rule" />
          <span className="sec-title mono">AI EMAIL ASSISTANT</span>
          <span className="sec-count mono">GMAIL CONNECTED</span>
        </div>

        <div className="card-crop p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="mono border border-[var(--line)] px-2.5 py-1 text-[.52rem] text-[var(--accent)]"
                  style={{ letterSpacing: ".2em", borderRadius: "99px" }}
                >
                  AI GENERATOR
                </span>
                <span className="mono text-[.56rem] text-[var(--g2)]" style={{ letterSpacing: ".22em" }}>
                  4 TEMPLATES · 1-CLICK DRAFT
                </span>
              </div>
              <h2 className="display text-[clamp(1.6rem,3vw,2.6rem)] text-[var(--ink)]">
                Soạn email ứng tuyển<br />
                chuẩn phong cách <span className="amp">&amp;</span> cá nhân hóa
              </h2>
              <p
                className="mt-4 max-w-xl text-[clamp(.92rem,1.4vw,1.05rem)] font-light leading-[1.65] text-[var(--g1)]"
                style={{ letterSpacing: "-.005em" }}
              >
                Tự động phân tích Job Description, đối chiếu với Portfolio và kinh nghiệm video editor của bạn để tạo thư ứng tuyển, thư follow-up hoặc phản hồi recruiter chuyên nghiệp.
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="mono text-[.58rem] text-[var(--g2)]" style={{ letterSpacing: ".24em" }}>
                CHỌN MẪU EMAIL:
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className="mono border border-[var(--line)] px-3 py-1.5 text-[.56rem] text-[var(--ink)]"
                  style={{ letterSpacing: ".16em", borderRadius: "99px" }}
                >
                  01. FIRST APPLICATION
                </span>
                <span
                  className="mono border border-[var(--line)] px-3 py-1.5 text-[.56rem] text-[var(--g1)]"
                  style={{ letterSpacing: ".16em", borderRadius: "99px" }}
                >
                  02. FOLLOW-UP
                </span>
                <span
                  className="mono border border-[var(--line)] px-3 py-1.5 text-[.56rem] text-[var(--g1)]"
                  style={{ letterSpacing: ".16em", borderRadius: "99px" }}
                >
                  03. RECRUITER REPLY
                </span>
              </div>
              <div className="mt-4">
                <a
                  href="#jobs"
                  className="footer-mail mono text-[.66rem] font-medium text-[var(--ink)]"
                  style={{ letterSpacing: ".26em" }}
                >
                  TẠO DRAFT EMAIL MỚI →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* section 05: system integration / status */}
      <footer id="system" className="border-t border-[var(--line)]" style={{ padding: "clamp(5rem, 12vh, 9rem) var(--pad) 2rem" }}>
        <div className="sec-head">
          <span className="sec-num mono">05</span>
          <span className="sec-rule" />
          <span className="sec-title mono">SYSTEM INTEGRATION &amp; AUTOMATION</span>
          <span className="sec-count mono">CRON 3H · GMAIL OAUTH2</span>
        </div>

        <h2 className="footer-h display">
          Track every<br />
          opportunity <span className="amp">&amp;</span>{" "}
          <a className="footer-mail" href="#jobs">
            reply
          </a>
        </h2>

        <div className="foot-grid mono mt-12">
          <div className="foot-col">
            <span className="foot-label">AUTO SYNC ENGINE</span>
            <span>Chu kỳ: 3 giờ / lần</span>
            <span className="text-[var(--accent)]">Status: Active (0 */3 * * *)</span>
          </div>
          <div className="foot-col">
            <span className="foot-label">9 JOB SOURCES</span>
            <span>LinkedIn · Upwork · Pickdi</span>
            <span>Workable · Himalayas · OnlineJobs</span>
            <span>Remotive · Remote OK · Arbeitnow</span>
          </div>
          <div className="foot-col">
            <span className="foot-label">EMAIL 2-WAY SYNC</span>
            <span>Gmail API (OAuth2)</span>
            <span className="text-[var(--g2)]">Scope: modify + send</span>
          </div>
          <div className="foot-col">
            <span className="foot-label">PORTFOLIO V2</span>
            <a href="https://oddpig.io.vn" target="_blank" rel="noreferrer">
              oddpig.io.vn
            </a>
            <span className="text-[var(--g2)]">Cuong Pham Quoc</span>
          </div>
        </div>

        <div className="foot-base mono">
          <span>© 2026 — REMOTECUT SYSTEM</span>
          <span>MONOCHROME CINEMA EDITION</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </>
  );
}
