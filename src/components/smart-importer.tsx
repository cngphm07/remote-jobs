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
    <div className="border border-[var(--line)] bg-[var(--surface)] p-7 md:p-10">
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2">
          <Link2 size={15} className="text-[var(--accent)]" />
          <span className="mono text-[.56rem] text-[var(--accent)]" style={{ letterSpacing: ".22em" }}>
            HỖ TRỢ LINK TỪ MỌI NỀN TẢNG
          </span>
        </div>
        <h2 className="display text-[clamp(1.4rem,2.4vw,2.1rem)] text-[var(--ink)]">
          Dán link bài tuyển dụng bất kỳ<br />
          để tự động bóc tách <span className="amp">&amp;</span> lưu trữ
        </h2>
        <p className="mt-3 text-[.88rem] font-light leading-relaxed text-[var(--g2)]">
          Tự động phân tích Schema JSON-LD, OpenGraph và trích xuất Tiêu đề, Công ty, Mức lương, Kỹ năng từ link LinkedIn, Upwork, Pickdi, Workable, Indeed, OnlineJobs.ph...
        </p>

        {/* URL input form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex items-center border border-[var(--line)] bg-[var(--bg)] p-2 focus-within:border-[var(--line2)]">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-0 min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-[.88rem] font-light text-[var(--ink)] outline-none placeholder:text-[var(--g3)]"
              placeholder="https://vn.linkedin.com/jobs/view/... hoặc link Upwork, Pickdi..."
            />
            <button
              type="submit"
              disabled={loading}
              className="filter-btn active flex shrink-0 items-center gap-1.5"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "ĐANG PHÂN TÍCH..." : "BÓC TÁCH & LƯU"}
            </button>
          </div>
        </form>

        {result && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-none border p-3 font-mono text-[.66rem] ${
              result.success
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {result.success ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
