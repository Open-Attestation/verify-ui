import { t, Selector } from "testcafe";
import { uploadDocument, validateIssuer, validateIframeText } from "./helper";

fixture("Multi tabs").page`http://localhost:3000`;

const tabMain = Selector("[data-testid='renderer-tab']", { timeout: 35000 }).withText("Main");
const tabPdf = Selector("[data-testid='renderer-tab']").withText("dummy.pdf");

test("Multi tabs should be rendered correctly", async () => {
  await uploadDocument("./certificate-attachments-goerli.json");
  await validateIssuer("example.openattestation.com");
  await t.expect(tabMain.exists).ok();
  await validateIframeText("John Doe");
  await t.expect(tabPdf.exists).ok();
  await t.click(tabPdf);
});
