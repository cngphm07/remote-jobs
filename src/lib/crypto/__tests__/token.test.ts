import { describe, expect, it } from "vitest";
import { decryptToken, encryptToken, TokenEncryptionConfigurationError } from "../token";

const key = "a-test-key-that-is-long-enough-for-sha256-derivation";

describe("token encryption", () => {
  it("round-trips without exposing plaintext", () => {
    const encrypted = encryptToken("refresh-secret", key);
    expect(encrypted).not.toContain("refresh-secret");
    expect(decryptToken(encrypted, key)).toBe("refresh-secret");
  });

  it("rejects tampered ciphertext", () => {
    const encrypted = encryptToken("refresh-secret", key);
    const parts = encrypted.split(".");
    parts[3] = `${parts[3][0] === "A" ? "B" : "A"}${parts[3].slice(1)}`;
    expect(() => decryptToken(parts.join("."), key)).toThrow();
  });

  it("rejects an inadequate key", () => {
    expect(() => encryptToken("token", "short")).toThrow(TokenEncryptionConfigurationError);
  });
});
