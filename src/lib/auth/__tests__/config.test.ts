import { describe, expect, it } from "vitest";
import { isOwnerEmail } from "../owner";

describe("single-user authorization", () => {
  it("accepts only the configured owner, case-insensitively", () => {
    expect(isOwnerEmail("Owner@Example.com", "owner@example.com")).toBe(true);
    expect(isOwnerEmail("other@example.com", "owner@example.com")).toBe(false);
  });

  it("fails closed when owner is missing", () => {
    expect(isOwnerEmail("owner@example.com", undefined)).toBe(false);
  });
});
