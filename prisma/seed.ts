import { PrismaClient, SourceKind } from "@prisma/client";

const prisma = new PrismaClient();

const sources = [
  {
    key: "vietnamworks",
    name: "VietnamWorks",
    kind: SourceKind.API,
    baseUrl: "https://ms.vietnamworks.com/job-search/v1.0/search",
  },
  {
    key: "linkedin",
    name: "LinkedIn Jobs",
    kind: SourceKind.CRAWLER,
    baseUrl: "https://www.linkedin.com/jobs",
  },
  {
    key: "upwork_rss",
    name: "Upwork",
    kind: SourceKind.RSS,
    baseUrl: "https://www.upwork.com/ab/feed/jobs/rss",
  },
  {
    key: "pickdi",
    name: "Pickdi Creative",
    kind: SourceKind.CRAWLER,
    baseUrl: "https://pickdi.com",
  },
  {
    key: "workable",
    name: "Workable",
    kind: SourceKind.API,
    baseUrl: "https://jobs.workable.com",
  },
  {
    key: "himalayas",
    name: "Himalayas",
    kind: SourceKind.API,
    baseUrl: "https://himalayas.app/jobs/api",
  },
  {
    key: "remotive",
    name: "Remotive",
    kind: SourceKind.API,
    baseUrl: "https://remotive.com/api/remote-jobs",
  },
  {
    key: "remoteok",
    name: "Remote OK",
    kind: SourceKind.API,
    baseUrl: "https://remoteok.com/api",
  },
  {
    key: "arbeitnow",
    name: "Arbeitnow",
    kind: SourceKind.API,
    baseUrl: "https://www.arbeitnow.com/api/job-board-api",
  },
  {
    key: "manual",
    name: "Direct Import",
    kind: SourceKind.MANUAL,
    baseUrl: "",
  },
] as const;

async function main() {
  for (const source of sources) {
    await prisma.jobSource.upsert({
      where: { key: source.key },
      update: source,
      create: source,
    });
  }

  // Deactivate or delete old onlinejobs_ph source if present
  const oldSource = await prisma.jobSource.findUnique({ where: { key: "onlinejobs_ph" } });
  if (oldSource) {
    await prisma.job.updateMany({
      where: { sourceId: oldSource.id },
      data: { isActive: false, staleAt: new Date() },
    });
    await prisma.jobSource.update({
      where: { id: oldSource.id },
      data: { enabled: false },
    });
  }

  const ownerEmail = (process.env.AUTH_OWNER_EMAIL || process.env.OWNER_EMAIL)?.trim().toLowerCase();
  if (ownerEmail) {
    const user = await prisma.user.upsert({
      where: { email: ownerEmail },
      update: {},
      create: { email: ownerEmail, name: "Owner" },
    });

    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        headline: "Remote Video Editor & Post-Production Specialist",
        targetRoles: ["Video Editor", "Motion Graphics Designer", "Colorist", "YouTube Editor"],
        skills: ["Premiere Pro", "DaVinci Resolve", "After Effects", "Final Cut Pro", "CapCut"],
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
