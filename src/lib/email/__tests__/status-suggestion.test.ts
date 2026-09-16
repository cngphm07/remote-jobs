import { describe, expect, it } from "vitest";
import { suggestApplicationStatus } from "../status-suggestion";

describe("status suggestion", () => {
  it("suggests interview without applying it automatically", () => {
    const result = suggestApplicationStatus("Can we schedule an interview next week?");
    expect(result.status).toBe("INTERVIEW");
    expect(result.requiresConfirmation).toBe(true);
  });

  it("does not classify outbound messages", () => {
    expect(suggestApplicationStatus("Interview availability", false).status).toBeNull();
  });
});
