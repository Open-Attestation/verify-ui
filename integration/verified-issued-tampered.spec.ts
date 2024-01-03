import { t, Selector } from "testcafe";
import { uploadDocument, validateIssuer } from "./helper";

fixture("Verified issued tampered").page`http://localhost:3000`;

const StatusCheck = Selector("[data-testid='verification-checks']");

test("Status check should reflect error correctly", async () => {
  await uploadDocument("./certificate-issued-tampered-sepolia.json");
  await validateIssuer("example.openattestation.com");
  await t.expect(StatusCheck.withText("Document has been tampered").exists).ok();
});
