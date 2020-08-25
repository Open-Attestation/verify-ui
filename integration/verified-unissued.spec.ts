import { t, Selector } from "testcafe";
import { uploadDocument } from "./helper";

fixture("Verified unissued").page`http://localhost:3000`;

const StatusCheck = Selector("[data-testid='status-check']");

test("Status check should reflect error correctly", async () => {
  await uploadDocument("./certificate-unissued-ropsten.json");
  await t.expect(StatusCheck.withText("Document has not been issued").exists).ok();
});
