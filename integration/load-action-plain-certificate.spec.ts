import { Selector } from "testcafe";
import "isomorphic-fetch";
import { validateIframeText, validateIssuer } from "./helper";

fixture("Load action from plain certificate").page`http://localhost:3000`;

const StatusCheck = Selector("[data-testid='status-check']");
const AlertContainer = Selector('[role="alert"]');

test("Load document from action should work when url is valid", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/Nebulis/49b53678e9b445f826125e4ac4f6d7a0/raw/0474e7b9c25dfdb95c046257483c218f27e60136/gistfile1.txt`,
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
test("Load document from action should fail when url can't be parsed", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/Nebulis/dc32c107fc5112ecf863b1dfa25995a9/raw/9aed3bfbbdd2b8/opencerts-ropsten-demo.json`,
      redirect: "https://verify.gov.sg/verify",
    },
  };

  // replace the first %22 after encoding by nothing so that the URL is not valid and can't be parsed
  await t.navigateTo(`http://localhost:3000/verify/?q=${encodeURI(JSON.stringify(action)).replace("%22", "")}`);
  await t.expect(AlertContainer.withText("The URL is malformed. The document could not be loaded").exists).ok();
});
test("Load document from action should fail when document does not exist", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/Nebulis/fake-path/raw/fake-path/opencerts-ropsten-demo.json`,
      redirect: "https://verify.gov.sg/verify",
    },
  };

  // replace the first %22 after encoding by nothing so that the URL is not valid and can't be parsed
  await t.navigateTo(`http://localhost:3000/verify/?q=${encodeURI(JSON.stringify(action))}`);
  await t
    .expect(
      AlertContainer.withText(
        `Unable to load the certificate from https://gist.githubusercontent.com/Nebulis/fake-path/raw/fake-path/opencerts-ropsten-demo.json`
      ).exists
    )
    .ok();
});

test("Load document from action should fail when action type is invalid", async (t) => {
  const action = {
    type: "DOCUM",
    payload: {
      uri: `https://gist.githubusercontent.com/Nebulis/49b53678e9b445f826125e4ac4f6d7a0/raw/0474e7b9c25dfdb95c046257483c218f27e60136/gistfile1.txt`,
      permittedAction: ["STORE"],
      redirect: "https://verify.gov.sg/verify",
    },
  };

  await t.navigateTo(`http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}`);
  await t.expect(AlertContainer.withText(`The type DOCUM provided from the action is not supported`).exists).ok();
});
