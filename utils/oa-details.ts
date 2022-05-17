import { utils, getData, v2, v3, OpenAttestationDocument } from "@govtechsg/open-attestation";

export const getTemplateUrl = (document: OpenAttestationDocument): string => {
  if (utils.isRawV2Document(document)) {
    const { $template } = document;
    if (typeof $template === "object" && typeof $template.url === "string") return $template.url;
    else if (typeof $template === "string") return "https://legacy.opencerts.io";
  } else {
    const { template } = document.openAttestationMetadata;
    if (template) return template.url;
  }

  console.warn("Unable to obtain template URL from wrapped document.");
  return "UNKNOWN_TEMPLATE_URL";
};

export const getDataV2OrV3 = (wrappedDocument: v2.WrappedDocument | v3.WrappedDocument) => {
  if (utils.isWrappedV2Document(wrappedDocument)) return getData(wrappedDocument);
  else return wrappedDocument as v3.OpenAttestationDocument;
};
