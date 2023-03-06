import { Selector } from "testcafe";
import { validateIframeText, validateIssuer } from "./helper";

fixture("Scan QR page on Barcode Scanner mode").page`http://localhost:3000/qr`.beforeEach(async (t) => {
  const SwitchToBarcodeScannerLink = Selector("li").withText("Switch to Barcode Scanner");
  await t.click(SwitchToBarcodeScannerLink);
});

const StatusCheck = Selector("[data-testid='verification-checks']");
const AlertContainer = Selector('[role="alert"]');

test("Barcode scanner on QR page should be on standby for input", async (t) => {
  await t.expect(Selector("p").withText("Ready, waiting for scan").exists).ok();

  await t.dispatchEvent(Selector("body"), "blur");
  await t.expect(Selector("p").withText("Not ready, current window not active").exists).ok();
  await t.expect(Selector("p").withText("Click here to resume").exists).ok();

  await t.dispatchEvent(Selector("body"), "focus");
  await t.expect(Selector("p").withText("Ready, waiting for scan").exists).ok();
});

test("Barcode scanner on QR page should be able to detect keyboard input", async (t) => {
  await t.expect(Selector("img[alt='Scan Icon']").exists).ok();
  await t.dispatchEvent(Selector("body"), "keydown", { key: "t" });
  await t.expect(Selector("svg[data-icon='circle-notch']").exists).ok();
  await t.wait(300).expect(Selector("img[alt='Scan Icon']").exists).ok();
});

test("Barcode scanner on QR page should be able to verify a valid QR", async (t) => {
  const action = {
    type: "DOCUMENT",
    payload: {
      uri: "https://schemata.openattestation.com/sg/gov/moh/pdt-healthcert/2.0/endorsed-wrapped.json",
      permittedActions: ["VIEW"],
      redirect: "https://www.verify.gov.sg/verify",
    },
  };

  const validVerifyUrl = `https://www.verify.gov.sg/verify?q=${encodeURI(JSON.stringify(action))}`;

  for (let char of validVerifyUrl) {
    await t.dispatchEvent(Selector("body"), "keydown", { key: char });
  }

  await t.pressKey("enter");

  await t.switchToWindow((w: WindowFilterData) => w.url.host === "www.verify.gov.sg");

  await validateIssuer("donotverify.testing.verify.gov.sg");
  await t.expect(StatusCheck.withText("Document has not been tampered").exists).ok();
  await t.expect(StatusCheck.withText("Document has been issued").exists).ok();
  await t.expect(StatusCheck.withText("Issued by Singapore Government").exists).ok();
  await validateIframeText("Tan Chen Chen");
});

test("Barcode scanner on QR page should throw error when verifying an invalid QR", async (t) => {
  const invalidVerifyUrl = `https://www.fake-verify.com/verify?q=fake`;

  for (let char of invalidVerifyUrl) {
    await t.dispatchEvent(Selector("body"), "keydown", { key: char });
  }

  await t.pressKey("enter");

  await t.expect(AlertContainer.withText(`Invalid Verify QR, please try again`).exists).ok();
});
