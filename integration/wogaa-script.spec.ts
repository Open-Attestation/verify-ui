import { RequestLogger } from "testcafe";
import "isomorphic-fetch";
import { URL } from "url";

fixture("Load action from encrypted certificate").page`http://localhost:3000`;

const key = "7b9fbe27e47485e71729ce9faf3e361e8e84b9a72092196826457fda0136d38a";

const sampleCert = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    $template: {
      name: "b2eb315a-a074-467c-b544-bc1a1abec466:string:main",
      type: "734e6906-6808-4463-a395-d7e49d425138:string:EMBEDDED_RENDERER",
      url: "4395f24d-7fd1-432a-acce-66e19c224688:string:https://tutorial-renderer.openattestation.com",
    },
    recipient: {
      name: "e87d55bd-3566-4abd-8335-3bfa481d0a7e:string:John Doe",
    },
    issuers: [
      {
        name: "c3e5dce6-32ce-470e-893a-9deb3980fd93:string:Demo Issuer",
        documentStore: "b94de29f-bf2c-4e8a-938f-6fe8b7993d1e:string:0xdAA795D7664F341B21125206e2e416AEB99e1841",
        identityProof: {
          type: "e17172cc-de99-441c-82aa-422b74f6b4f8:string:DNS-TXT",
          location: "1b0499cf-976c-4750-8632-6cacc2a3bae8:string:example.openattestation.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "919534bc6cdf6f05f29f87fc59423959c027a2f8926bb743eef884d53ed4eaf4",
    proof: [],
    merkleRoot: "919534bc6cdf6f05f29f87fc59423959c027a2f8926bb743eef884d53ed4eaf4",
  },
};

const logger = RequestLogger(/wogaa/, {
  logRequestHeaders: true,
  logRequestBody: true,
  logResponseHeaders: true,
  logResponseBody: true,
});

test("Wogaa should not capture key data in HOSTED_URL", async (t) => {
  const anchor = { key };
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/501c38d7f65d71000e520be77422d03c/raw/c9c86e0aee61b0365077454acc3b366aedd7975a/certificate-issued-goerli-encrypted.json`,
      permittedAction: ["STORE"],
      redirect: "https://verify.gov.sg/verify",
    },
  };
  await t
    .navigateTo(
      `http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}#${encodeURI(JSON.stringify(anchor))}`
    )
    .addRequestHooks(logger)
    .wait(2000);

  // ensure wogaa (1) loads, (2) and a url is being captured
  await t.expect(logger.requests.length).eql(2);
  const wogaaUrl = logger.requests.filter((req) => req.request.url.includes("?url="))[0].request.url;
  // ensure wogaa only capture scrubbed url
  const capturedUrlString = new URL(wogaaUrl).searchParams.get("url");
  await t.expect(capturedUrlString).eql(`http://localhost:3000/verify`);
});

test("Wogaa should not capture information in URI_FRAGMENT", async (t) => {
  await t
    .navigateTo(`http://localhost:3000/verify?m=uri-fragment#${encodeURI(JSON.stringify(sampleCert))}`)
    .addRequestHooks(logger)
    .wait(2000);

  // ensure wogaa (1) loads, (2) and a url is being captured
  await t.expect(logger.requests.length).eql(2);
  const wogaaUrl = logger.requests.filter((req) => req.request.url.includes("?url="))[0].request.url;
  // ensure wogaa only capture scrubbed url
  const capturedUrlString = new URL(wogaaUrl).searchParams.get("url");
  await t.expect(capturedUrlString).eql(`http://localhost:3000/verify`);
});

test("Wogaa should capture correct URL when there is no universal actions", async (t) => {
  await t.navigateTo(`http://localhost:3000/verify`).addRequestHooks(logger).wait(2000);

  // ensure wogaa (1) loads, (2) and a url is being captured
  await t.expect(logger.requests.length).eql(2);
  const wogaaUrl = logger.requests.filter((req) => req.request.url.includes("?url="))[0].request.url;
  // ensure wogaa only capture scrubbed url
  const capturedUrlString = new URL(wogaaUrl).searchParams.get("url");
  await t.expect(capturedUrlString).eql(`http://localhost:3000/verify`);
});

test("Wogaa should load on homepage", async (t) => {
  await t.addRequestHooks(logger).wait(2000);

  // ensure wogaa (1) loads, (2) and a url is being captured
  await t.expect(logger.requests.length).eql(2);
  const wogaaUrl = logger.requests.filter((req) => req.request.url.includes("?url="))[0].request.url;
  // ensure wogaa only capture scrubbed url
  const capturedUrlString = new URL(wogaaUrl).searchParams.get("url");
  await t.expect(capturedUrlString).eql(`http://localhost:3000/`);
});

test("Wogaa should capture information normally in non-verify urls", async (t) => {
  await t
    .navigateTo(`http://localhost:3000/faq?q=%7B%22foo%22%3A%22bar%22%7D%23%7B%20%22key%22%3A%20%22foobar%22%20%7D`)
    .addRequestHooks(logger)
    .wait(2000);

  // ensure wogaa (1) loads, (2) and a url is being captured
  await t.expect(logger.requests.length).eql(2);
  const wogaaUrl = logger.requests.filter((req) => req.request.url.includes("?url="))[0].request.url;
  // ensure wogaa captures the entire url in non-verify url
  const capturedUrlString = new URL(wogaaUrl).searchParams.get("url");
  await t
    .expect(capturedUrlString)
    .eql(`http://localhost:3000/faq?q=%7B%22foo%22%3A%22bar%22%7D%23%7B%20%22key%22%3A%20%22foobar%22%20%7D`);
});
