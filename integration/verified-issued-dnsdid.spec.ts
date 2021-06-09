import { uploadDocument, validateIssuer, validateIframeText } from "./helper";

fixture("Verified issued").page`http://localhost:3000`;

test("Document should be verified correctly", async () => {
  await uploadDocument("./certificate-issued-dnsdid.json");
  await validateIssuer("donotverify.testing.verify.gov.sg");
  await validateIframeText("Reverse transcription polymerase chain reaction (rRT-PCR) test");
});
