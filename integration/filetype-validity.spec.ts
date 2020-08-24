import { t, Selector } from "testcafe";
import { uploadDocument } from "./helper";

fixture("Filetype validity").page`http://localhost:3000`;

const FileError = Selector("[data-testid='file-error'] *");

test("Filetype error should reflect correctly", async () => {
  await uploadDocument("./image.png");
  await t.expect(FileError.withText("The file uploaded is not a valid Open Attestation file").exists).ok();
});
