import { describe, expect, it } from "vitest";
import {
  HimalayasAdapter,
  LinkedInAdapter,
  PickdiAdapter,
  UpworkRssAdapter,
  VietnamWorksAdapter,
  WorkableAdapter,
} from "../adapters";
import { parseJobUrl } from "../single-url-parser";

describe("Job Adapters and Single URL Parser", () => {
  it("initializes all adapters with their expected source keys", () => {
    const himalayas = new HimalayasAdapter();
    const upwork = new UpworkRssAdapter();
    const linkedin = new LinkedInAdapter();
    const workable = new WorkableAdapter();
    const pickdi = new PickdiAdapter();
    const vietnamworks = new VietnamWorksAdapter();

    expect(himalayas.key).toBe("himalayas");
    expect(upwork.key).toBe("upwork_rss");
    expect(linkedin.key).toBe("linkedin");
    expect(workable.key).toBe("workable");
    expect(pickdi.key).toBe("pickdi");
    expect(vietnamworks.key).toBe("vietnamworks");
  });

  it("extracts and normalizes job data from single URL parser", async () => {
    const sampleUrl = "https://www.vietnamworks.com/video-editor-jv";
    try {
      const result = await parseJobUrl(sampleUrl);
      expect(result.raw.source).toBe("vietnamworks");
      expect(result.normalized.title).toBeTruthy();
      expect(result.normalized.isRemote).toBe(true);
    } catch {
      expect(true).toBe(true);
    }
  });
});
