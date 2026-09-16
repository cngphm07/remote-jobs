import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cuong Pham Quoc — Résumé · Media Leader & Filmmaker",
  description:
    "Pham Quoc Cuong — Media Leader, Media Producer, Filmmaker, Video Editor, Operation Manager. Nearly 10 years of experience across TVC, documentary, architecture film and corporate branding.",
};

export default function ResumesPage() {
  return (
    <>
      {/* film grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* header */}
      <header className="site-header">
        <a href="#top" className="logo">
          CNGP<em>HM</em>
        </a>
        <nav className="mono">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="https://oddpig.io.vn" className="mono border border-[var(--line2)] px-3 py-1.5 text-[.62rem] rounded-full hover:bg-[var(--ink)] hover:text-black transition-all">
          PORTFOLIO ↗
        </a>
      </header>

      {/* hero */}
      <section className="resume-hero" id="top">
        <div className="relative z-[3]">
          <p className="hero-kicker mono">RÉSUMÉ — 2026</p>
          <h1 className="hero-name display">Cuong Pham Quoc</h1>
          <p className="hero-title-text display">
            Filmmaker <span className="amp">&amp;</span> Media Producer
          </p>
          <p className="hero-roles mono">
            MEDIA LEADER · POST PRODUCTION OPERATION MANAGER · VIDEO EDITOR · MARKETING SUPERVISOR
          </p>

          <div className="hero-meta mono">
            <div>
              <b className="display">10</b>
              <span>YEARS EXP</span>
            </div>
            <div>
              <b className="display">10+</b>
              <span>ORGANIZATIONS</span>
            </div>
            <div>
              <b className="display">6+</b>
              <span>GLOBAL BRANDS</span>
            </div>
            <div>
              <b className="display">2</b>
              <span>FILM AWARDS</span>
            </div>
          </div>
        </div>
      </section>

      {/* section 01: about */}
      <section className="resume-section" id="about">
        <div className="sec-head">
          <span className="sec-num mono">01</span>
          <span className="sec-rule" />
          <span className="sec-title-label mono">ABOUT ME</span>
        </div>
        <p className="about-lead">
          I&apos;m <b>Pham Quoc Cuong</b> — a media leader &amp; producer with nearly 10 years of
          experience in video production and brand storytelling. Over the course of my career,
          I have led diverse roles from Data Specialist, DOP Assistant, QTAKE &amp; Stream Operator,
          to Post-Production Operation Manager and Indie Filmmaker.
        </p>
        <p className="about-lead" style={{ marginTop: "1.2rem" }}>
          I cover the full production lifecycle — from pre-production planning and on-set execution
          to post-production finishing, color grading and special effects. I have collaborated with
          filmmakers and clients across Singapore, Malaysia, Australia, and Morocco, and produced visual
          content for international brands including Google, Honda, Lazada, Shopee, PepsiCo and Unilever.
        </p>

        <div className="brands mono" aria-label="Brands worked with">
          <span>GOOGLE</span>
          <span>HONDA</span>
          <span>LAZADA</span>
          <span>SHOPEE</span>
          <span>PEPSICO</span>
          <span>UNILEVER</span>
        </div>

        <div className="about-contact-inline">
          <a href="mailto:cuongphamworks@gmail.com">cuongphamworks@gmail.com</a>
          <a href="tel:+84971807891">+84 97 180 7891</a>
          <span className="zalo-pill mono">ZALO</span>
          <a href="tel:+84336167122">+84 336 167 122</a>
        </div>
      </section>

      {/* section 02: experience */}
      <section className="resume-section" id="experience">
        <div className="sec-head">
          <span className="sec-num mono">02</span>
          <span className="sec-rule" />
          <span className="sec-title-label mono">EXPERIENCE</span>
          <span className="sec-count mono">10 POSITIONS</span>
        </div>

        <div className="exp-list">
          {/* 1. Freelancer */}
          <article className="exp-item">
            <time className="exp-date mono">2018 — NOW</time>
            <div>
              <h3 className="exp-role">Freelance Filmmaker / Producer / Video Editor</h3>
              <p className="exp-company">Independent · Worldwide &amp; Vietnam</p>
              <ul className="exp-desc">
                <li>
                  Direct, produce, edit and color-grade high-standard visual projects across Documentary, Architecture, TV Commercials, and Music Videos.
                </li>
                <li>
                  Partner with creative agencies, international filmmakers and global brands across Vietnam, Singapore, Malaysia, Australia, and Morocco (Google, Honda, Lazada, Shopee, PepsiCo, Unilever).
                </li>
              </ul>
            </div>
          </article>

          {/* 2. Butecco */}
          <article className="exp-item">
            <time className="exp-date mono">2024 — 2026</time>
            <div>
              <h3 className="exp-role">Media Leader</h3>
              <p className="exp-company">Butecco Design &amp; Build</p>
              <ul className="exp-desc">
                <li>
                  Took overall responsibility for visual strategy, video production and architectural photography.
                </li>
                <li>
                  Directed and managed creative deliverables for premium design and construction projects.
                </li>
              </ul>
            </div>
          </article>

          {/* 3. Dat Thu */}
          <article className="exp-item">
            <time className="exp-date mono">2022 — 2024</time>
            <div>
              <h3 className="exp-role">Media Leader</h3>
              <p className="exp-company">Dat Thu Design &amp; Construction</p>
              <ul className="exp-desc">
                <li>
                  Led visual content creation, brand documentary, video and architectural photography.
                </li>
                <li>
                  Produced signature architectural media covered on major national press (PLO.vn).
                </li>
              </ul>
            </div>
          </article>

          {/* 4. Manh Nguyen / Overco */}
          <article className="exp-item">
            <time className="exp-date mono">2021 — 2022</time>
            <div>
              <h3 className="exp-role">Marketing Supervisor / Manager</h3>
              <p className="exp-company">Manh Nguyen Investment Development Co. LTD</p>
              <ul className="exp-desc">
                <li>
                  Took full responsibility for the Overco men fashion brand marketing and visual campaigns.
                </li>
                <li>
                  Built end-to-end operational workflows for the Marketing Department.
                </li>
                <li>
                  Managed sales operations, driving monthly revenue milestones reaching 100M+ VND.
                </li>
              </ul>
            </div>
          </article>

          {/* 5. OneCut */}
          <article className="exp-item">
            <time className="exp-date mono">2020 — 2022</time>
            <div>
              <h3 className="exp-role">
                Operation Manager / DOP Assistant / Stream &amp; QTAKE Specialist / Filmmaker
              </h3>
              <p className="exp-company">OneCut Production House</p>
              <ul className="exp-desc">
                <li>
                  Operated as DOP Assistant, QTAKE Specialist and DIT for large-scale commercial sets.
                </li>
                <li>
                  Livestream Operator for broadcast events; led R&amp;D for Virtual Production workflows.
                </li>
              </ul>
            </div>
          </article>

          {/* 6. RICE / Digipost */}
          <article className="exp-item">
            <time className="exp-date mono">2019 — 2020</time>
            <div>
              <h3 className="exp-role">Filmmaker / Visual Artist</h3>
              <p className="exp-company">RICE Content &amp; Media / Digipost Production House</p>
              <ul className="exp-desc">
                <li>
                  Worked as a filmmaker producing documentary films and TV commercial spots.
                </li>
                <li>
                  Engaged in visual artistry, cinematography and creative development.
                </li>
              </ul>
            </div>
          </article>

          {/* 7. Hao Phuong */}
          <article className="exp-item">
            <time className="exp-date mono">2018 — 2019</time>
            <div>
              <h3 className="exp-role">Video Editor / Photographer</h3>
              <p className="exp-company">Hao Phuong Corporation</p>
              <ul className="exp-desc">
                <li>
                  Produced corporate videos, event documentation, and technical photography.
                </li>
              </ul>
            </div>
          </article>

          {/* 8. Sao Do */}
          <article className="exp-item">
            <time className="exp-date mono">2017 — 2018</time>
            <div>
              <h3 className="exp-role">Video Editor / Set Designer</h3>
              <p className="exp-company">Sao Do Production</p>
              <ul className="exp-desc">
                <li>
                  Video editing, visual artistry, and on-set design for commercial productions.
                </li>
              </ul>
            </div>
          </article>

          {/* 9. Topica */}
          <article className="exp-item">
            <time className="exp-date mono">2017</time>
            <div>
              <h3 className="exp-role">Event Staff &amp; Producer</h3>
              <p className="exp-company">Topica Edutech Group</p>
              <ul className="exp-desc">
                <li>
                  Event contributor and content producer for student community programs.
                </li>
              </ul>
            </div>
          </article>

          {/* 10. FPT Education */}
          <article className="exp-item">
            <time className="exp-date mono">2015 — 2017</time>
            <div>
              <h3 className="exp-role">Copywriter</h3>
              <p className="exp-company">FPT Education Group — Cóc Đọc Magazine</p>
              <ul className="exp-desc">
                <li>
                  Wrote editorial articles, features and creative copy for Cóc Đọc student magazine.
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* section 03: skills */}
      <section className="resume-section" id="skills">
        <div className="sec-head">
          <span className="sec-num mono">03</span>
          <span className="sec-rule" />
          <span className="sec-title-label mono">SKILLS &amp; CAPABILITIES</span>
        </div>

        <div className="skills-grid">
          <div className="skill-group">
            <p className="skill-label mono">PRODUCTION</p>
            <span>Pre-production Planning &amp; Treatment</span>
            <span>On-set Directing &amp; Cinematography</span>
            <span>DOP Assistant &amp; Camera Operator</span>
            <span>QTAKE Specialist &amp; DIT Data</span>
            <span>Livestream &amp; Virtual Production R&amp;D</span>
          </div>

          <div className="skill-group">
            <p className="skill-label mono">POST-PRODUCTION</p>
            <span>Video Editing (Offline &amp; Online)</span>
            <span>Color Grading &amp; Film Emulation</span>
            <span>Visual Effects (VFX) &amp; Finishing</span>
            <span>Motion Graphics &amp; Typography</span>
            <span>Sound Design &amp; Audio Mixing</span>
          </div>

          <div className="skill-group">
            <p className="skill-label mono">TOOLS &amp; SOFTWARE</p>
            <span>Adobe Premiere Pro · After Effects</span>
            <span>DaVinci Resolve (Edit &amp; Color)</span>
            <span>Final Cut Pro · Cinema 4D · Nuke</span>
            <span>QTAKE HD · FilmConvert · Photoshop</span>
          </div>

          <div className="skill-group">
            <p className="skill-label mono">MANAGEMENT &amp; MARKETING</p>
            <span>Media Team Leadership</span>
            <span>Post-Production Operations</span>
            <span>Marketing Department Workflows</span>
            <span>Visual Branding &amp; Architecture Film</span>
            <span>Digital Campaign Strategy</span>
          </div>
        </div>
      </section>

      {/* section 04: education & honors */}
      <section className="resume-section" id="education">
        <div className="sec-head">
          <span className="sec-num mono">04</span>
          <span className="sec-rule" />
          <span className="sec-title-label mono">EDUCATION &amp; HONORS</span>
        </div>

        <div className="dual-grid">
          <div>
            <p className="sub-sec-title mono">EDUCATION</p>
            <div className="info-item">
              <h3 className="info-title">Bachelor of Software Engineering</h3>
              <p className="info-sub">FPT University</p>
              <p className="info-meta mono">2015 — 2019</p>
            </div>
          </div>

          <div>
            <p className="sub-sec-title mono">AWARDS &amp; PRESS</p>
            <div className="info-item">
              <h3 className="info-title">Best Pictures &amp; Best Sound Design</h3>
              <p className="info-sub">48 Hour Film Project</p>
              <p className="info-meta mono">2020</p>
            </div>
            <div className="info-item">
              <h3 className="info-title">Featured Architectural Media</h3>
              <p className="info-sub">Pháp Luật TP.HCM (PLO.vn) — “Ngôi nhà ở Bình Dương ấn tượng với màu đen huyền bí”</p>
              <a
                className="press-link mono"
                href="https://plo.vn/ngoi-nha-o-binh-duong-an-tuong-voi-mau-den-huyen-bi-post795848.html"
                target="_blank"
                rel="noreferrer"
              >
                READ ARTICLE ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* section 05: contact footer */}
      <footer className="resume-footer" id="contact">
        <div className="sec-head">
          <span className="sec-num mono">05</span>
          <span className="sec-rule" />
          <span className="sec-title-label mono">CONTACT</span>
        </div>

        <h2 className="footer-h display">
          Let&apos;s make<br />
          something{" "}
          <a className="footer-mail" href="mailto:cuongphamworks@gmail.com">
            together
          </a>
        </h2>

        <div className="foot-grid mono">
          <div className="foot-col">
            <span className="foot-label">EMAIL</span>
            <a href="mailto:cuongphamworks@gmail.com">cuongphamworks@gmail.com</a>
          </div>
          <div className="foot-col">
            <span className="foot-label">PHONE — ZALO</span>
            <a href="tel:+84971807891">+84 97 180 7891</a>
            <a href="tel:+84336167122">+84 336 167 122</a>
          </div>
          <div className="foot-col">
            <span className="foot-label">LOCATION</span>
            <span>Ho Chi Minh City, Vietnam</span>
          </div>
          <div className="foot-col">
            <span className="foot-label">PORTFOLIO</span>
            <a href="https://oddpig.io.vn" target="_blank" rel="noreferrer">
              oddpig.io.vn
            </a>
          </div>
        </div>

        <div className="foot-base mono">
          <span>© 2026 — CUONG PHAM QUOC</span>
          <span>RÉSUMÉ — MONOCHROME EDITION</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </>
  );
}
