import { t, Selector } from "testcafe";
import { uploadDocument } from "./helper";

fixture("Filetype validity").page`http://localhost:3000`;

const AlertContainer = Selector('[role="alert"]');

test("Filetype error should reflect correctly", async () => {
  await uploadDocument("./image.png");
  await t.expect(AlertContainer.withText("The uploaded file is not a valid OpenAttestation document").exists).ok();
});
