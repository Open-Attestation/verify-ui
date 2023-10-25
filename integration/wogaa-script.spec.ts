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

test("Wogaa should capture correct URL for non-verify pages", async (t) => {
  await t
    .navigateTo(`http://localhost:3000/faq?m=uri-fragment#${encodeURI(JSON.stringify(sampleCert))}`)
    .addRequestHooks(logger)
    .wait(2000);

  // TODO: remove this
  logger.requests.forEach((req) => console.log(req.request.url));
  // ensure wogaa (1) loads, (2) and a url is being captured
  await t.expect(logger.requests.length).eql(2);
  const wogaaUrl = logger.requests.filter((req) => req.request.url.includes("?url="))[0].request.url;
  // ensure wogaa only capture scrubbed url
  const capturedUrlString = new URL(wogaaUrl).searchParams.get("url");
  await t
    .expect(capturedUrlString)
    .eql(
      `http://localhost:3000/faq?m=uri-fragment#%7B%22version%22:%22https://schema.openattestation.com/2.0/schema.json%22,%22data%22:%7B%22$template%22:%7B%22name%22:%22b2eb315a-a074-467c-b544-bc1a1abec466:string:main%22,%22type%22:%22734e6906-6808-4463-a395-d7e49d425138:string:EMBEDDED_RENDERER%22,%22url%22:%224395f24d-7fd1-432a-acce-66e19c224688:string:https://tutorial-renderer.openattestation.com%22%7D,%22recipient%22:%7B%22name%22:%22e87d55bd-3566-4abd-8335-3bfa481d0a7e:string:John%20Doe%22%7D,%22issuers%22:%5B%7B%22name%22:%22c3e5dce6-32ce-470e-893a-9deb3980fd93:string:Demo%20Issuer%22,%22documentStore%22:%22b94de29f-bf2c-4e8a-938f-6fe8b7993d1e:string:0xdAA795D7664F341B21125206e2e416AEB99e1841%22,%22identityProof%22:%7B%22type%22:%22e17172cc-de99-441c-82aa-422b74f6b4f8:string:DNS-TXT%22,%22location%22:%221b0499cf-976c-4750-8632-6cacc2a3bae8:string:example.openattestation.com%22%7D%7D%5D%7D,%22signature%22:%7B%22type%22:%22SHA3MerkleProof%22,%22targetHash%22:%22919534bc6cdf6f05f29f87fc59423959c027a2f8926bb743eef884d53ed4eaf4%22,%22proof%22:%5B%5D,%22merkleRoot%22:%22919534bc6cdf6f05f29f87fc59423959c027a2f8926bb743eef884d53ed4eaf4%22%7D%7D`
    );
});

test("Wogaa should load on non-verify pages", async (t) => {
  await t.navigateTo(`http://localhost:3000/faq`).addRequestHooks(logger).wait(2000);

  // TODO: remove this
  logger.requests.forEach((req) => console.log(req.request.url));
  // ensure wogaa (1) loads, (2) and a url is being captured
  await t.expect(logger.requests.length).eql(2);
  const wogaaUrl = logger.requests.filter((req) => req.request.url.includes("?url="))[0].request.url;
  // ensure wogaa only capture scrubbed url
  const capturedUrlString = new URL(wogaaUrl).searchParams.get("url");
  await t.expect(capturedUrlString).eql(`http://localhost:3000/faq`);
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
