import { getUniversalActionType } from "./get-universal-action-type";

describe("getUniversalActionType", () => {
  it("should return NONE", async () => {
    expect(getUniversalActionType()).toBe("NONE");
    expect(getUniversalActionType({})).toBe("NONE");
    expect(getUniversalActionType({ q: undefined, m: undefined })).toBe("NONE");
    expect(getUniversalActionType({ m: "" })).toBe("NONE");
  });

  it("should return HOSTED_URL", async () => {
    expect(getUniversalActionType({ q: "" })).toBe("HOSTED_URL");
    expect(getUniversalActionType({ q: "{}" })).toBe("HOSTED_URL");
    expect(getUniversalActionType({ q: "somestring" })).toBe("HOSTED_URL");
  });

  it("should return EMBEDDED_URI_FRAGMENT", async () => {
    expect(getUniversalActionType({ q: "", m: "uri-fragment" })).toBe("EMBEDDED_URI_FRAGMENT");
    expect(getUniversalActionType({ q: "{}", m: "uri-fragment" })).toBe("EMBEDDED_URI_FRAGMENT");
    expect(getUniversalActionType({ q: "somestring", m: "uri-fragment" })).toBe("EMBEDDED_URI_FRAGMENT");
  });
});
