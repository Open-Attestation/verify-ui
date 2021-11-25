/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { t, Selector } from "testcafe";

const LinkVerify = Selector("button").withText("Verify");
const FileInput = Selector("input[type=file]");
const Issuer = Selector("h2").withText("Issued by");
const Iframe = Selector("iframe[title='Decentralised Rendered Certificate']");

export const uploadDocument = async (documentPath: string) => {
  await t.click(LinkVerify);
  await t.setFilesToUpload(FileInput, [documentPath]);
};

export const validateIssuer = async (issuer: string) => {
  await t.expect(Issuer.textContent).contains(issuer);
};

export const validateIframeText = async (text: string) => {
  await t.switchToIframe(Iframe);
  await t.expect(Selector("*").withText(text).exists).ok();
  await t.switchToMainWindow();
};
