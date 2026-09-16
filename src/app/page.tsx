import { Sparkles } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { InteractiveJobs } from "@/components/interactive-jobs";
import { SmartImporter } from "@/components/smart-importer";

const pipeline = [
  { label: "SAVED", count: 18, desc: "Đã lưu", accent: false },
  { label: "PREPARING", count: 6, desc: "Đang soạn", accent: false },
  { label: "APPLIED", count: 12, desc: "Đã gửi hồ sơ", accent: true },
  { label: "REPLIED", count: 5, desc: "Có phản hồi", accent: false },
  { label: "INTERVIEW", count: 3, desc: "Phỏng vấn", accent: false },
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
          <span className="hero-side mono">REMOTECUT — 2026</span>
          <span className="hero-side-r mono">EVERY 3 HOURS · GLOBAL</span>
        </div>

        <div className="relative z-[3]">
          <p className="hero-kicker mono">
            <Sparkles size={11} className="mr-2 inline-block text-[var(--accent)]" />
            AUTOMATED REEL — CURATED WORLDWIDE
          </p>

          <h1 className="hero-title display">
            REMOTE VIDEO EDITOR<br />
            <span className="amp">&amp;</span> POST-PRODUCTION
          </h1>

          <p className="hero-desc">
            Hệ thống tự động tổng hợp việc làm <b>Video Editor Remote</b> toàn cầu từ <b>LinkedIn, Upwork, Pickdi, Workable, Himalayas, OnlineJobs</b>. Tự động đồng bộ mỗi 3 giờ, hỗ trợ AI soạn thảo email ứng tuyển cá nhân hóa và đồng bộ 2 chiều với Gmail.
          </p>

          {/* hero meta */}
          <div className="hero-meta mono">
            <div>
              <b className="display text-[var(--ink)]">380+</b>
              <span>ROLES</span>
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
        </div>
      </div>

      {/* section 01: pipeline */}
      <section id="pipeline" style={{ padding: "clamp(3.5rem, 7vh, 5.5rem) var(--pad)" }}>
        <div className="sec-head">
          <span className="sec-num mono">01</span>
          <span className="sec-rule" />
          <span className="sec-title mono">APPLICATION PIPELINE</span>
          <span className="sec-count mono">44 TOTAL</span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-[1.2rem] md:grid-cols-5 md:gap-[1.6rem]">
          {pipeline.map((item) => (
            <div
              key={item.label}
              className="card-crop p-6 md:p-7 transition-colors hover:border-[var(--line2)]"
            >
              <p className="mono text-[.54rem] text-[var(--g2)]" style={{ letterSpacing: ".24em" }}>
                {item.label}
              </p>
              <p
                className={`display mt-4 text-[clamp(2rem,3.4vw,2.8rem)] ${
                  item.accent ? "text-[var(--accent)]" : "text-[var(--ink)]"
                }`}
              >
                {item.count}
              </p>
              <p className="mono mt-2 text-[.52rem] text-[var(--g3)]" style={{ letterSpacing: ".16em" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* section 02: curated jobs (Interactive Component) */}
      <section id="jobs" style={{ padding: "clamp(3.5rem, 7vh, 5.5rem) var(--pad)", borderTop: "1px solid var(--line)" }}>
        <div className="sec-head">
          <span className="sec-num mono">02</span>
          <span className="sec-rule" />
          <span className="sec-title mono">CURATED JOBS (UPDATED EVERY 3H)</span>
          <span className="sec-count mono">9 PLATFORMS</span>
        </div>

        <div className="mt-8">
          <InteractiveJobs />
        </div>
      </section>

      {/* section 03: quick URL import (Interactive Component) */}
      <section id="import" style={{ padding: "clamp(3.5rem, 7vh, 5.5rem) var(--pad)", borderTop: "1px solid var(--line)" }}>
        <div className="sec-head">
          <span className="sec-num mono">03</span>
          <span className="sec-rule" />
          <span className="sec-title mono">SMART URL IMPORTER</span>
          <span className="sec-count mono">INSTANT PARSE</span>
        </div>

        <div className="mt-8">
          <SmartImporter />
        </div>
      </section>

      {/* section 04: email assistant */}
      <section id="assistant" style={{ padding: "clamp(3.5rem, 7vh, 5.5rem) var(--pad)", borderTop: "1px solid var(--line)" }}>
        <div className="sec-head">
          <span className="sec-num mono">04</span>
          <span className="sec-rule" />
          <span className="sec-title mono">AI EMAIL ASSISTANT</span>
          <span className="sec-count mono">GMAIL CONNECTED</span>
        </div>

        <div className="mt-7 border border-[var(--line)] bg-[var(--surface)] p-7 md:p-9 lg:p-10 transition-colors hover:border-[var(--line2)]">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="mono border border-[var(--line)] px-2.5 py-1 text-[.54rem] text-[var(--accent)]"
                  style={{ letterSpacing: ".18em", borderRadius: "99px" }}
                >
                  AI ENGINE
                </span>
                <span className="mono text-[.56rem] text-[var(--g2)]" style={{ letterSpacing: ".2em" }}>
                  4 TEMPLATES · 1-CLICK DRAFT
                </span>
              </div>
              <h2 className="display text-[clamp(1.5rem,2.8vw,2.3rem)] leading-[1.08] text-[var(--ink)]">
                Soạn email ứng tuyển<br />
                chuẩn phong cách <span className="amp">&amp;</span> cá nhân hóa
              </h2>
              <p className="mt-4 max-w-xl text-[clamp(.9rem,1.4vw,1.05rem)] font-light leading-[1.7] text-[var(--g1)]">
                Tự động đối chiếu Job Description với Portfolio và kinh nghiệm video editor của bạn để tạo thư ứng tuyển, thư follow-up hoặc phản hồi recruiter chuyên nghiệp.
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="mono text-[.58rem] text-[var(--g2)]" style={{ letterSpacing: ".22em" }}>
                CHỌN MẪU EMAIL:
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className="mono border border-[var(--line)] px-3 py-1.5 text-[.54rem] text-[var(--ink)]"
                  style={{ letterSpacing: ".14em", borderRadius: "99px" }}
                >
                  01. FIRST APPLICATION
                </span>
                <span
                  className="mono border border-[var(--line)] px-3 py-1.5 text-[.54rem] text-[var(--g1)]"
                  style={{ letterSpacing: ".14em", borderRadius: "99px" }}
                >
                  02. FOLLOW-UP
                </span>
                <span
                  className="mono border border-[var(--line)] px-3 py-1.5 text-[.54rem] text-[var(--g1)]"
                  style={{ letterSpacing: ".14em", borderRadius: "99px" }}
                >
                  03. RECRUITER REPLY
                </span>
              </div>
              <div className="mt-3">
                <a
                  href="#jobs"
                  className="footer-mail mono text-[.64rem] font-medium text-[var(--ink)]"
                  style={{ letterSpacing: ".22em" }}
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

        <div className="foot-grid mono mt-10">
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
