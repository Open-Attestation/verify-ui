import zlib from "zlib";
import fetch from "node-fetch";
import { RequestLogger, Selector } from "testcafe";

export const getBody = async (body: Buffer): Promise<string> =>
  new Promise((resolve, reject) => {
    // testcafe does not unzip
    zlib.gunzip(body, async (error, buff) => {
      if (error !== null) {
        return reject(error);
      }
      return resolve(buff.toString());
    });
  });

const statsLogger = RequestLogger(
  { url: "https://app.infura.io/api/stats/request-volume", method: "post" },
  {
    logResponseBody: true,
  }
);
fixture("Infura Monitoring").page`https://infura.io/login`;

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

const getRequestCount = async (requestLogger: RequestLogger) => {
  let tries = 30;
  while (tries-- > 0) {
    for (const request of requestLogger.requests) {
      const body = request.response?.body;
      if (!body) continue;
      const parsedBody = JSON.parse(Buffer.isBuffer(body) ? await getBody(body) : body);
      const time = parsedBody?.data?.[0]?.query?.time;
      // there are multiple stats call. We only want the one for the past 24h
      if (time?.from === "24h" && time?.tick === "h") {
        const results = parsedBody.data[0].result;
        return results.reduce((acc: any, cur: any) => acc + cur.value, 0);
      }
    }
    await sleep(1000);
  }
  throw new Error("Could not find the stats");
};

const openGithubIssue = async (requestCount: number) => {
  await fetch("https://api.github.com/repos/Open-Attestation/verify.gov.sg/issues", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ title: `Alert - ${requestCount} requests on Infura` }),
  });
};

test("Status check should reflect error correctly", async (t) => {
  // temporarily set cookie to dismiss Sep 2022 modal
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).valueOf().toString();
  await t.setCookies({ merge_acked: fiveMinsAgo, terms_accepted: fiveMinsAgo }, "https://infura.io");

  // login
  await t.typeText(Selector("[data-testid='field_email']"), process.env.INFURA_EMAIL ?? "");
  await t.typeText(Selector("[data-testid='field_password']"), process.env.INFURA_PASSWORD ?? "");
  await t.click(Selector("[data-testid='auth-button']"));

  // wait to see the create project button
  await Selector("[data-testid='create-project']").with({ visibilityCheck: true })();

  // go to verify.gov.sg project
  await t.click(Selector("p").withText("verify.gov.sg")).addRequestHooks(statsLogger);

  const requestCount = await getRequestCount(statsLogger);
  const maximumRequest = 1000000;
  const thresholdPercentage = 60; // 60%
  const threshold = (maximumRequest * thresholdPercentage) / 100;
  if (requestCount > threshold) {
    await openGithubIssue(requestCount);
  }
});
