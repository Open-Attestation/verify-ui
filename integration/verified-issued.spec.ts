import { uploadDocument, validateIssuer, validateIframeText } from "./helper";

fixture("Verified issued").page`http://localhost:3000`;

test("Document should be verified correctly", async () => {
  await uploadDocument("./certificate-issued-ropsten.json");
  await validateIssuer("brew.tk");
  await validateIframeText("John Doe");
});
