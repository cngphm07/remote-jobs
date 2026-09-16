export type GmailCredential = {
  userId: string;
  accessToken?: string | null;
  encryptedRefreshToken?: string | null;
  expiresAt?: number | null;
};

export type SyncedMessage = {
  gmailMessageId: string;
  gmailThreadId: string;
  direction: "INBOUND" | "OUTBOUND";
  from: string;
  to: string;
  subject: string;
  snippet: string;
  sentAt: Date;
  applicationId?: string | null;
  statusSuggestion?: string | null;
};

export interface GmailRepository {
  getCredential(ownerEmail: string): Promise<GmailCredential | null>;
  updateCredential(userId: string, value: { accessToken?: string; encryptedRefreshToken?: string; expiresAt?: number }): Promise<void>;
  findApplicationId(threadId: string, messageHeaders: Record<string, string>): Promise<string | null>;
  saveMessages(messages: SyncedMessage[]): Promise<number>;
}

export class DatabaseUnavailableError extends Error {
  constructor(message = "Gmail database repository is not configured") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

let repository: GmailRepository | null = null;

/** Injected by the persistence layer to avoid coupling Gmail logic to a particular Prisma schema. */
export function setGmailRepository(value: GmailRepository | null): void {
  repository = value;
}

export function getGmailRepository(): GmailRepository {
  if (!repository) throw new DatabaseUnavailableError();
  return repository;
}
