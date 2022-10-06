import { Selector } from "testcafe";
import "isomorphic-fetch";
import { validateIframeText, validateIssuer } from "./helper";

fixture("Load action from encrypted certificate").page`http://localhost:3000`;

const AlertContainer = Selector('[role="alert"]');
const StatusCheck = Selector("[data-testid='verification-checks']");

const key = "7b9fbe27e47485e71729ce9faf3e361e8e84b9a72092196826457fda0136d38a";

test("Load document from action should work when action is valid (key from anchor)", async (t) => {
  const anchor = { key };
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/501c38d7f65d71000e520be77422d03c/raw/c9c86e0aee61b0365077454acc3b366aedd7975a/certificate-issued-goerli-encrypted.json`,
      permittedAction: ["STORE"],
      redirect: "https://verify.gov.sg/verify",
    },
  };
  await t.navigateTo(
    `http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}#${encodeURI(JSON.stringify(anchor))}`
  );
  await validateIssuer("example.openattestation.com");
  await t.expect(StatusCheck.withText("Document has not been tampered").exists).ok();
  await t.expect(StatusCheck.withText("Document has been issued").exists).ok();
  await t.expect(StatusCheck.withText("Document’s issuer has been identified").exists).ok();
  await validateIframeText("John Doe");
});

test("Load document from action should work when action is valid", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/501c38d7f65d71000e520be77422d03c/raw/c9c86e0aee61b0365077454acc3b366aedd7975a/certificate-issued-goerli-encrypted.json`,
      key,
      permittedAction: ["STORE"],
      redirect: "https://verify.gov.sg/verify",
    },
  };
  await t.navigateTo(`http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}`);
  await validateIssuer("example.openattestation.com");
  await t.expect(StatusCheck.withText("Document has not been tampered").exists).ok();
  await t.expect(StatusCheck.withText("Document has been issued").exists).ok();
  await t.expect(StatusCheck.withText("Document’s issuer has been identified").exists).ok();
  await validateIframeText("John Doe");
});

test("Load document from action should fail when key is invalid (key from anchor)", async (t) => {
  const anchor = {
    key: "2a237b35cb50544a2c9a4b4a629e7c547bd1ff4a0137489700891532001e83f6", // random key, must have correct length
  };
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/501c38d7f65d71000e520be77422d03c/raw/c9c86e0aee61b0365077454acc3b366aedd7975a/certificate-issued-goerli-encrypted.json`,
      permittedAction: ["STORE"],
      redirect: "https://verify.gov.sg/verify",
    },
  };

  await t.navigateTo(
    `http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}#${encodeURI(JSON.stringify(anchor))}`
  );
  await t.expect(AlertContainer.withText(`Error decrypting message`).exists).ok();
});

test("Load document from action should fail when key is invalid", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/501c38d7f65d71000e520be77422d03c/raw/c9c86e0aee61b0365077454acc3b366aedd7975a/certificate-issued-goerli-encrypted.json`,
      permittedAction: ["STORE"],
      redirect: "https://verify.gov.sg/verify",
      key: "2a237b35cb50544a2c9a4b4a629e7c547bd1ff4a0137489700891532001e83f6", // random key, must have correct length
    },
  };

  await t.navigateTo(`http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}`);
  await t.expect(AlertContainer.withText(`Error decrypting message`).exists).ok();
});

test("Load document from action should fail when the required key is not provided", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/501c38d7f65d71000e520be77422d03c/raw/c9c86e0aee61b0365077454acc3b366aedd7975a/certificate-issued-goerli-encrypted.json`,
      permittedAction: ["STORE"],
      redirect: "https://verify.gov.sg/verify",
    },
  };

  await t.navigateTo(`http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}`);
  await t
    .expect(
      AlertContainer.withText(`Unable to decrypt certificate with key=undefined and type=OPEN-ATTESTATION-TYPE-1`)
        .exists
    )
    .ok();
});
