import { google, gmail_v1 } from "googleapis";
import { decryptToken, encryptToken } from "@/lib/crypto/token";
import { suggestApplicationStatus } from "@/lib/email/status-suggestion";
import { getGmailRepository, type GmailRepository, type SyncedMessage } from "@/lib/gmail/repository";

export class GmailConfigurationError extends Error {
  constructor(message = "Gmail OAuth credentials are not configured") {
    super(message);
    this.name = "GmailConfigurationError";
  }
}

export type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
  applicationId?: string;
  threadId?: string;
};

function headerValue(headers: gmail_v1.Schema$MessagePartHeader[] | undefined, name: string): string {
  return headers?.find((item) => item.name?.toLowerCase() === name.toLowerCase())?.value || "";
}

function encodeMessage(input: SendEmailInput, from: string): string {
  const lines = [
    `From: ${from}`,
    `To: ${input.to}`,
    `Subject: ${input.subject.replace(/[\r\n]/g, " ")}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    ...(input.applicationId ? [`X-Application-ID: ${input.applicationId}`] : []),
    "",
    input.body,
  ];
  return Buffer.from(lines.join("\r\n"), "utf8").toString("base64url");
}

export class GmailService {
  constructor(private readonly repository: GmailRepository = getGmailRepository()) {}

  private async client(ownerEmail: string): Promise<gmail_v1.Gmail> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new GmailConfigurationError();

    const credential = await this.repository.getCredential(ownerEmail);
    if (!credential) throw new GmailConfigurationError("No Gmail account is connected for the owner");
    const oauth = new google.auth.OAuth2(clientId, clientSecret);
    oauth.setCredentials({
      access_token: credential.accessToken || undefined,
      refresh_token: credential.encryptedRefreshToken ? decryptToken(credential.encryptedRefreshToken) : undefined,
      expiry_date: credential.expiresAt ? credential.expiresAt * 1000 : undefined,
    });
    oauth.on("tokens", async (tokens) => {
      await this.repository.updateCredential(credential.userId, {
        ...(tokens.access_token ? { accessToken: tokens.access_token } : {}),
        ...(tokens.refresh_token ? { encryptedRefreshToken: encryptToken(tokens.refresh_token) } : {}),
        ...(tokens.expiry_date ? { expiresAt: Math.floor(tokens.expiry_date / 1000) } : {}),
      });
    });
    return google.gmail({ version: "v1", auth: oauth });
  }

  async send(ownerEmail: string, input: SendEmailInput): Promise<{ id: string | null; threadId: string | null }> {
    const gmail = await this.client(ownerEmail);
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodeMessage(input, ownerEmail), threadId: input.threadId },
    });
    return { id: response.data.id ?? null, threadId: response.data.threadId ?? null };
  }

  async sync(ownerEmail: string, maxResults = 50): Promise<{ fetched: number; saved: number }> {
    const gmail = await this.client(ownerEmail);
    const list = await gmail.users.messages.list({ userId: "me", maxResults, q: "newer_than:30d" });
    const messages: SyncedMessage[] = [];

    for (const item of list.data.messages || []) {
      if (!item.id) continue;
      const response = await gmail.users.messages.get({ userId: "me", id: item.id, format: "metadata" });
      const data = response.data;
      if (!data.id || !data.threadId) continue;
      const headers = data.payload?.headers;
      const from = headerValue(headers, "From");
      const to = headerValue(headers, "To");
      const subject = headerValue(headers, "Subject");
      const metadata = Object.fromEntries((headers || []).map((header) => [header.name || "", header.value || ""]));
      const inbound = !from.toLowerCase().includes(ownerEmail.toLowerCase());
      const applicationId = await this.repository.findApplicationId(data.threadId, metadata);
      const suggestion = suggestApplicationStatus(`${subject}\n${data.snippet || ""}`, inbound);
      messages.push({
        gmailMessageId: data.id,
        gmailThreadId: data.threadId,
        direction: inbound ? "INBOUND" : "OUTBOUND",
        from,
        to,
        subject,
        snippet: data.snippet || "",
        sentAt: new Date(Number(data.internalDate || Date.now())),
        applicationId,
        statusSuggestion: suggestion.status,
      });
    }

    return { fetched: messages.length, saved: await this.repository.saveMessages(messages) };
  }
}
