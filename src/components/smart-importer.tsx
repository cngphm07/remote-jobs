"use client";

import { useState } from "react";
import { Link2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function SmartImporter() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/jobs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult({
          success: true,
          message: `Đã bóc tách thành công: "${data.job?.title}" tại ${data.job?.company}`,
        });
        setUrl("");
      } else {
        setResult({
          success: false,
          message: data.error?.message || "Không thể phân tích URL hoặc bạn cần đăng nhập",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Lỗi kết nối khi gửi yêu cầu bóc tách",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[var(--line)] bg-[var(--surface)] p-8 md:p-11 lg:p-12 transition-colors hover:border-[var(--line2)]">
      <div className="max-w-3xl">
        <div className="mb-4 flex items-center gap-2.5">
          <Link2 size={15} className="text-[var(--accent)]" />
          <span className="mono text-[.58rem] text-[var(--accent)]" style={{ letterSpacing: ".24em" }}>
            UNIVERSAL PLATFORM PARSER
          </span>
        </div>

        <h2 className="display mt-2 text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.12] text-[var(--ink)]">
          Dán link bài tuyển dụng bất kỳ<br />
          để tự động bóc tách <span className="amp">&amp;</span> lưu trữ
        </h2>

        <p className="mt-5 max-w-2xl text-[clamp(.9rem,1.4vw,1.05rem)] font-light leading-[1.75] text-[var(--g2)]">
          Hệ thống tự động phân tích cấu trúc Schema JSON-LD, OpenGraph và trích xuất Tiêu đề, Công ty, Mức lương, Kỹ năng từ link VietnamWorks, LinkedIn, Upwork, Pickdi, Workable, Indeed...
        </p>

        {/* URL input form with comfortable spacing */}
        <form onSubmit={handleSubmit} className="mt-9">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:border sm:border-[var(--line)] sm:bg-[var(--bg)] sm:p-2.5 focus-within:border-[var(--line2)]">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[.9rem] font-light text-[var(--ink)] outline-none placeholder:text-[var(--g3)] sm:border-0 sm:bg-transparent sm:px-3 sm:py-2"
              placeholder="https://vn.linkedin.com/jobs/view/... hoặc link Upwork, Pickdi, Workable..."
            />
            <button
              type="submit"
              disabled={loading}
              className="filter-btn active flex shrink-0 items-center justify-center gap-2 px-5 py-3 text-[.6rem] sm:py-2.5"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "ĐANG PHÂN TÍCH..." : "BÓC TÁCH & LƯU"}
            </button>
          </div>
        </form>

        {result && (
          <div
            className={`mt-6 flex items-center gap-2.5 border p-4 font-mono text-[.68rem] ${
              result.success
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {result.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
