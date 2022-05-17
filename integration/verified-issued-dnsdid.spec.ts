import { t, Selector } from "testcafe";
import { uploadDocument, validateIssuer, validateIframeText } from "./helper";

fixture("Verified issued").page`http://localhost:3000`;

const StatusCheck = Selector("[data-testid='verification-checks']");

test("Document should be verified correctly", async () => {
  await uploadDocument("./certificate-issued-dnsdid.json");
  await validateIssuer("donotverify.testing.verify.gov.sg");
  await validateIframeText("Reverse transcription polymerase chain reaction (rRT-PCR) test");
});

test("HealthCerts should have custom verification text", async () => {
  await uploadDocument("./certificate-issued-dnsdid.json");
  await validateIssuer("donotverify.testing.verify.gov.sg");
  await t.expect(StatusCheck.withText("Issued by Singapore Government").exists).ok();
});
