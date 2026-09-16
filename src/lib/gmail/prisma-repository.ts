import type { PrismaClient } from "@prisma/client";
import { decryptToken, encryptToken } from "@/lib/crypto/token";
import type { GmailCredential, GmailRepository, SyncedMessage } from "./repository";

export class PrismaGmailRepository implements GmailRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getCredential(ownerEmail: string): Promise<GmailCredential | null> {
    const account = await this.prisma.account.findFirst({
      where: { provider: "google", user: { email: ownerEmail } },
      select: { userId: true, access_token: true, refresh_token: true, expires_at: true },
    });
    if (!account) return null;
    return {
      userId: account.userId,
      accessToken: account.access_token ? decryptToken(account.access_token) : null,
      encryptedRefreshToken: account.refresh_token,
      expiresAt: account.expires_at,
    };
  }

  async updateCredential(userId: string, value: { accessToken?: string; encryptedRefreshToken?: string; expiresAt?: number }): Promise<void> {
    await this.prisma.account.updateMany({
      where: { userId, provider: "google" },
      data: {
        ...(value.accessToken ? { access_token: encryptToken(value.accessToken) } : {}),
        ...(value.encryptedRefreshToken ? { refresh_token: value.encryptedRefreshToken } : {}),
        ...(value.expiresAt ? { expires_at: value.expiresAt } : {}),
      },
    });
  }

  async findApplicationId(threadId: string, headers: Record<string, string>): Promise<string | null> {
    const existing = await this.prisma.emailThread.findUnique({ where: { gmailThreadId: threadId }, select: { applicationId: true } });
    if (existing?.applicationId) return existing.applicationId;
    const explicitId = headers["X-Application-ID"] || headers["x-application-id"];
    if (!explicitId) return null;
    const application = await this.prisma.application.findUnique({ where: { id: explicitId }, select: { id: true } });
    return application?.id ?? null;
  }

  async saveMessages(messages: SyncedMessage[]): Promise<number> {
    let saved = 0;
    for (const message of messages) {
      const user = await this.prisma.user.findFirst({ where: { accounts: { some: { provider: "google" } } }, select: { id: true } });
      if (!user) continue;
      const thread = await this.prisma.emailThread.upsert({
        where: { gmailThreadId: message.gmailThreadId },
        update: { applicationId: message.applicationId, subject: message.subject, snippet: message.snippet, lastMessageAt: message.sentAt },
        create: { userId: user.id, applicationId: message.applicationId, gmailThreadId: message.gmailThreadId, subject: message.subject, snippet: message.snippet, lastMessageAt: message.sentAt },
      });
      await this.prisma.emailMessage.upsert({
        where: { gmailMessageId: message.gmailMessageId },
        update: { snippet: message.snippet, subject: message.subject },
        create: { threadId: thread.id, gmailMessageId: message.gmailMessageId, direction: message.direction, status: message.direction === "INBOUND" ? "RECEIVED" : "SENT", subject: message.subject, snippet: message.snippet, fromAddress: message.from, toAddresses: [message.to], sentAt: message.sentAt, receivedAt: message.direction === "INBOUND" ? message.sentAt : null },
      });
      saved += 1;
    }
    return saved;
  }
}
