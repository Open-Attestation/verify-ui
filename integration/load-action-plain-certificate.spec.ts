import { Selector } from "testcafe";
import "isomorphic-fetch";
import { validateIframeText, validateIssuer } from "./helper";

fixture("Load action from plain certificate").page`http://localhost:3000`;

const AlertContainer = Selector('[role="alert"]');
const StatusCheck = Selector("[data-testid='verification-checks']");

test("Load document from action should work when url is valid", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/5791c0d1e28ba841210f33f8d9c458e6/raw/6d5f839a7152f8d561e6d994f60e00052f33ec8f/certificate-issued-sepolia.json`,
      redirect: "http://localhost:3000",
    },
  };

  await t.navigateTo(`http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}`);
  await validateIssuer("example.openattestation.com");
  await t.expect(StatusCheck.withText("Document has not been tampered").exists).ok();
  await t.expect(StatusCheck.withText("Document has not been revoked").exists).ok();
  await t.expect(StatusCheck.withText("Document’s issuer has been identified").exists).ok();
  await validateIframeText("John Doe");
});

test("Load document from action should fail when url can't be parsed", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/5791c0d1e28ba841210f33f8d9c458e6/raw/6d5f839a7152f8d561e6d994f60e00052f33ec8f/certificate-issued-sepolia.json`,
      redirect: "http://localhost:3000",
    },
  };

  // replace the first %22 after encoding by nothing so that the URL is not valid and can't be parsed
  await t.navigateTo(`http://localhost:3000/verify/?q=${encodeURI(JSON.stringify(action)).replace("%22", "")}`);
  await t.expect(AlertContainer.withText("The URL is malformed so the document cannot be loaded").exists).ok();
});

test("Load document from action should fail when document does not exist", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/fake-path/raw/fake-path/non-existent-certificate.json`,
      redirect: "http://localhost:3000",
    },
  };

  await t.navigateTo(`http://localhost:3000/verify/?q=${encodeURI(JSON.stringify(action))}`);
  await t.expect(AlertContainer.withText(`An error occurred while displaying your document`).exists).ok();
});

test("Load document from action should fail when action type is invalid", async (t) => {
  const action = {
    type: "DOCUM",
    payload: {
      uri: `https://gist.githubusercontent.com/john-dot-oa/5791c0d1e28ba841210f33f8d9c458e6/raw/6d5f839a7152f8d561e6d994f60e00052f33ec8f/certificate-issued-sepolia.json`,
      permittedAction: ["STORE"],
      redirect: "http://localhost:3000",
    },
  };

  await t.navigateTo(`http://localhost:3000/verify?q=${encodeURI(JSON.stringify(action))}`);
  await t.expect(AlertContainer.withText(`The provided action/anchor is unsupported`).exists).ok();
  await t.expect(AlertContainer.withText(`"type": Expected literal \`DOCUMENT\`, but was \`DOCUM\``).exists).ok();
});
