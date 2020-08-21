import { uploadDocument, validateIssuer, validateIframeText } from "./helper";

fixture("Verified issuer").page`http://localhost:3000`;

test("Document should be verified correctly", async () => {
  await uploadDocument("./certificate-ropsten.json");
  await validateIssuer("brew.tk");
  await validateIframeText("John Doe");
});
