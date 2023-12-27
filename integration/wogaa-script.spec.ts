import { RequestLogger } from "testcafe";
import "isomorphic-fetch";

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
      uri: `https://gist.githubusercontent.com/john-dot-oa/501c38d7f65d71000e520be77422d03c/raw/c9c86e0aee61b0365077454acc3b366aedd7975a/certificate-issued-sepolia-encrypted.json`,
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
  await t
    .expect(
      logger.contains((record) =>
        record.request.url.includes(`/scripts/wogaa.js?url=http%3A%2F%2Flocalhost%3A3000%2Fverify`)
      )
    )
    .eql(true);
});

test("Wogaa should not capture information in URI_FRAGMENT", async (t) => {
  await t
    .navigateTo(`http://localhost:3000/verify?m=uri-fragment#${encodeURI(JSON.stringify(sampleCert))}`)
    .addRequestHooks(logger)
    .wait(2000);
  await t
    .expect(
      logger.contains((record) =>
        record.request.url.includes(`/scripts/wogaa.js?url=http%3A%2F%2Flocalhost%3A3000%2Fverify`)
      )
    )
    .eql(true);
});

test("Wogaa should capture correct URL when there is no universal actions", async (t) => {
  await t.navigateTo(`http://localhost:3000/verify`).addRequestHooks(logger).wait(2000);
  await t
    .expect(
      logger.contains((record) =>
        record.request.url.includes(`/scripts/wogaa.js?url=http%3A%2F%2Flocalhost%3A3000%2Fverify`)
      )
    )
    .eql(true);
});

test("Wogaa should capture entire URL for non-verify pages", async (t) => {
  await t.navigateTo(`http://localhost:3000/faq`).addRequestHooks(logger).wait(2000);
  await t
    .expect(
      logger.contains((record) =>
        record.request.url.includes(`/scripts/wogaa.js?url=http%3A%2F%2Flocalhost%3A3000%2Ffaq`)
      )
    )
    .eql(true);
});

test("Wogaa should capture entire URL for non-verify pages", async (t) => {
  await t
    .navigateTo(`http://localhost:3000/faq?m=uri-fragment#${encodeURI(JSON.stringify(sampleCert))}`)
    .addRequestHooks(logger)
    .wait(2000);

  await t
    .expect(
      logger.contains((record) =>
        record.request.url.includes(
          `/scripts/wogaa.js?url=http%3A%2F%2Flocalhost%3A3000%2Ffaq%3Fm%3Duri-fragment%23%257B%2522version%2522%3A%2522https%3A%2F%2Fschema.openattestation.com%2F2.0%2Fschema.json%2522%2C%2522data%2522%3A%257B%2522%24template%2522%3A%257B%2522name%2522%3A%2522b2eb315a-a074-467c-b544-bc1a1abec466%3Astring%3Amain%2522%2C%2522type%2522%3A%2522734e6906-6808-4463-a395-d7e49d425138%3Astring%3AEMBEDDED_RENDERER%2522%2C%2522url%2522%3A%25224395f24d-7fd1-432a-acce-66e19c224688%3Astring%3Ahttps%3A%2F%2Ftutorial-renderer.openattestation.com%2522%257D%2C%2522recipient%2522%3A%257B%2522name%2522%3A%2522e87d55bd-3566-4abd-8335-3bfa481d0a7e%3Astring%3AJohn%2520Doe%2522%257D%2C%2522issuers%2522%3A%255B%257B%2522name%2522%3A%2522c3e5dce6-32ce-470e-893a-9deb3980fd93%3Astring%3ADemo%2520Issuer%2522%2C%2522documentStore%2522%3A%2522b94de29f-bf2c-4e8a-938f-6fe8b7993d1e%3Astring%3A0xdAA795D7664F341B21125206e2e416AEB99e1841%2522%2C%2522identityProof%2522%3A%257B%2522type%2522%3A%2522e17172cc-de99-441c-82aa-422b74f6b4f8%3Astring%3ADNS-TXT%2522%2C%2522location%2522%3A%25221b0499cf-976c-4750-8632-6cacc2a3bae8%3Astring%3Aexample.openattestation.com%2522%257D%257D%255D%257D%2C%2522signature%2522%3A%257B%2522type%2522%3A%2522SHA3MerkleProof%2522%2C%2522targetHash%2522%3A%2522919534bc6cdf6f05f29f87fc59423959c027a2f8926bb743eef884d53ed4eaf4%2522%2C%2522proof%2522%3A%255B%255D%2C%2522merkleRoot%2522%3A%2522919534bc6cdf6f05f29f87fc59423959c027a2f8926bb743eef884d53ed4eaf4%2522%257D%257D`
        )
      )
    )
    .eql(true);
});

test("Wogaa should capture entire URL for homepage", async (t) => {
  await t.addRequestHooks(logger).wait(2000);
  await t
    .expect(
      logger.contains((record) => record.request.url.includes(`/scripts/wogaa.js?url=http%3A%2F%2Flocalhost%3A3000%2F`))
    )
    .eql(true);
});
