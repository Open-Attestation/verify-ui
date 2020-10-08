import { Selector } from "testcafe";
import "isomorphic-fetch";
import { validateIframeText, validateIssuer } from "./helper";

fixture("Load action from encrypted certificate").page`http://localhost:3000`;

const AlertContainer = Selector('[role="alert"]');
const StatusCheck = Selector("[data-testid='status-check']");

const key = "c246183c5dacff3a90ab82024ba2361b4bd8f9ade0b443f7c2d0cc5eebe9c8ca";

test("Load document from action should work when action is valid", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/Nebulis/49b53678e9b445f826125e4ac4f6d7a0/raw/ff6b53474fa24534f4f8c3c4aa89d17ac82a6289/encrypted-oa-issuer`,
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

test("Load document from action should fail when key is invalid", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/Nebulis/49b53678e9b445f826125e4ac4f6d7a0/raw/ff6b53474fa24534f4f8c3c4aa89d17ac82a6289/encrypted-oa-issuer`,
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
      uri: `https://gist.githubusercontent.com/Nebulis/328b757c7b56aa5a7d537c88cd250f92/raw/2816aad4811846ee8cd554bd19e08706da19ae09/e2e.json`,
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
