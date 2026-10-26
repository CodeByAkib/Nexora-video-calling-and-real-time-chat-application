import { describe, expect, it } from "vitest";
import { createCallId } from "./callId";

describe("createCallId", () => {
  it("is long, URL-safe and unique per call (not derived from user ids)", () => {
    const ids = new Set(Array.from({ length: 200 }, createCallId));
    expect(ids.size).toBe(200);
    for (const id of ids) expect(id).toMatch(/^[a-f0-9-]{32,36}$/);
  });
});
