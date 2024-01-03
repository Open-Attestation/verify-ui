import { Selector } from "testcafe";
import "isomorphic-fetch";
import { validateIframeText, validateIssuer } from "./helper";

fixture("Load action from encrypted certificate").page`http://localhost:3000`;

const AlertContainer = Selector('[role="alert"]');
const StatusCheck = Selector("[data-testid='verification-checks']");

const key = "96127947a132c2b1c9696dfc89179aa510df040cc8d2094ef8958e8225bf3fb1";

test("Load document from action should work when action is valid (key from anchor)", async (t) => {
  const anchor = { key };
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/5791c0d1e28ba841210f33f8d9c458e6/raw/6d5f839a7152f8d561e6d994f60e00052f33ec8f/certificate-issued-sepolia-encrypted.json`,
      permittedAction: ["STORE"],
    },
  };
  await t.navigateTo(
    `http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}#${encodeURI(JSON.stringify(anchor))}`
  );
  await validateIssuer("example.openattestation.com");
  await t.expect(StatusCheck.withText("Document has not been tampered").exists).ok();
  await t.expect(StatusCheck.withText("Document has not been revoked").exists).ok();
  await t.expect(StatusCheck.withText("Document’s issuer has been identified").exists).ok();
  await validateIframeText("John Doe");
});

test("Load document from action should work when action is valid", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/5791c0d1e28ba841210f33f8d9c458e6/raw/6d5f839a7152f8d561e6d994f60e00052f33ec8f/certificate-issued-sepolia-encrypted.json`,
      key,
      permittedAction: ["STORE"],
    },
  };
  await t.navigateTo(`http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}`);
  await validateIssuer("example.openattestation.com");
  await t.expect(StatusCheck.withText("Document has not been tampered").exists).ok();
  await t.expect(StatusCheck.withText("Document has not been revoked").exists).ok();
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
      uri: `https://gist.githubusercontent.com/john-dot-oa/5791c0d1e28ba841210f33f8d9c458e6/raw/6d5f839a7152f8d561e6d994f60e00052f33ec8f/certificate-issued-sepolia-encrypted.json`,
      permittedAction: ["STORE"],
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
      uri: `https://gist.githubusercontent.com/john-dot-oa/5791c0d1e28ba841210f33f8d9c458e6/raw/6d5f839a7152f8d561e6d994f60e00052f33ec8f/certificate-issued-sepolia-encrypted.json`,
      permittedAction: ["STORE"],
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
      uri: `https://gist.githubusercontent.com/john-dot-oa/5791c0d1e28ba841210f33f8d9c458e6/raw/6d5f839a7152f8d561e6d994f60e00052f33ec8f/certificate-issued-sepolia-encrypted.json`,
      permittedAction: ["STORE"],
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
