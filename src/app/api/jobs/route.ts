import { NextResponse } from "next/server";
import { getActiveRecentJobs, getLatestJobSyncSummary } from "@/lib/jobs/queries";

export async function GET() {
  try {
    const [jobs, latestSync] = await Promise.all([
      getActiveRecentJobs(),
      getLatestJobSyncSummary(),
    ]);

    return NextResponse.json({ jobs, latestSync });
  } catch {
    return NextResponse.json(
      { error: { code: "JOBS_UNAVAILABLE", message: "Không thể tải danh sách việc làm hiện tại" } },
      { status: 503 },
    );
  }
}
