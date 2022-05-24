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
  { url: "https://infura.io/api/stats/request-activity", method: "post" },
  {
    logResponseBody: true,
  }
);
fixture("Infura Monitoring").page`https://infura.io/login`;

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

const getRequestCount = async (requestLogger: RequestLogger) => {
  let tries = 30;
  while (tries-- > 0) {
    let requestCountTotal = 0;
    for (const request of requestLogger.requests) {
      const body = request.response?.body;
      if (!body) continue;
      const parsedBody = JSON.parse(Buffer.isBuffer(body) ? await getBody(body) : body);
      const time = parsedBody?.data?.[0]?.query?.time;
      if (time?.from === "24h" && time?.tick === "h") {
        const results = parsedBody.data[0].result;

        for (let i = 0; i < results.length; i++) {
          let reqcount = results[i].value;
          requestCountTotal += reqcount;
        }


        if (requestCountTotal > 0){
          console.log("total api calls : " + requestCountTotal);
          return requestCountTotal;
        }
      }
    }
    
    await sleep(5000);
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

const notifySlack = async (requestCount: number, threshold: number) => {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({ 
      text: `ALERT - ${requestCount} REQUESTS ON INFURA, current API limit is ${threshold}` 
    }),
  });
};

test("Status check should reflect error correctly", async (t) => {
  // login
  await t.typeText(Selector("[data-testid='field_email']"), process.env.INFURA_EMAIL ?? "");
  await t.typeText(Selector("[data-testid='field_password']"), process.env.INFURA_PASSWORD ?? "");
  await t.click(Selector("[data-testid='auth-button']"));

  // wait to be logged in
  await Selector("[data-testid='header-user-icon']");

  await t.navigateTo("https://infura.io/dashboard/stats/ethereum/24h/all-projects").addRequestHooks(statsLogger);

  // wait to see the create project button
  await Selector("[data-testid='create-project']");

  const requestCount = await getRequestCount(statsLogger);
  const maximumRequest = Number(String(process.env.INFURA_THRESHOLD)) ?? 1000000;
  const thresholdPercentage = 60; // 60%
  const threshold = (maximumRequest * thresholdPercentage) / 100;
  console.log(`current request count is ${requestCount} out of ${maximumRequest}`)
  if (requestCount > threshold) {
    if (process.env.SLACK_WEBHOOK_URL){
      await notifySlack(requestCount, threshold);
    }
    else {
      await openGithubIssue(requestCount);
    }
  }
});
