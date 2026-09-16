import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const VERSION = "v1";
const ALGORITHM = "aes-256-gcm";

export class TokenEncryptionConfigurationError extends Error {
  constructor(message = "TOKEN_ENCRYPTION_KEY is not configured") {
    super(message);
    this.name = "TokenEncryptionConfigurationError";
  }
}

function encryptionKey(secret = process.env.TOKEN_ENCRYPTION_KEY): Buffer {
  if (!secret) throw new TokenEncryptionConfigurationError();

  // Accept a 32-byte base64 value, while also deriving a stable key from a long passphrase.
  const decoded = Buffer.from(secret, "base64");
  if (decoded.length === 32 && decoded.toString("base64").replace(/=+$/, "") === secret.replace(/=+$/, "")) {
    return decoded;
  }
  if (secret.length < 32) {
    throw new TokenEncryptionConfigurationError("TOKEN_ENCRYPTION_KEY must be at least 32 characters or 32-byte base64");
  }
  return createHash("sha256").update(secret, "utf8").digest();
}

export function encryptToken(value: string, secret?: string): string {
  if (!value) throw new Error("Cannot encrypt an empty token");
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, encryptionKey(secret), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), ciphertext.toString("base64url")].join(".");
}

export function decryptToken(payload: string, secret?: string): string {
  const [version, encodedIv, encodedTag, encodedCiphertext, extra] = payload.split(".");
  if (version !== VERSION || !encodedIv || !encodedTag || !encodedCiphertext || extra) {
    throw new Error("Invalid encrypted token format");
  }

  const decipher = createDecipheriv(ALGORITHM, encryptionKey(secret), Buffer.from(encodedIv, "base64url"));
  decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
