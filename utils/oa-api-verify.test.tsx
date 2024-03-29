import axios from "axios";

import { apiVerifyWithFallback } from "@utils/oa-api-verify";
import * as oaVerify from "@utils/oa-verify";

jest.mock("@utils/oa-verify", () => {
  const originalModule = jest.requireActual('@utils/oa-verify');
  return {
    __esModule: true,
    ...originalModule,
    verify: jest.fn(() => Promise.resolve([])),
  };
});

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockImplementationOnce(async () => {
  throw new Error("Axios mocked error");
});

describe("oa-api-verify with fallback", () => {
  it("should fallback to oa-verify when api.verify.gov.sg is unsuccessful", async () => {
    const spy = jest.spyOn(oaVerify, "verify");

    await apiVerifyWithFallback({ foo: "bar" } as any);

    expect(spy).toBeCalledWith({ foo: "bar" });
  });
});
