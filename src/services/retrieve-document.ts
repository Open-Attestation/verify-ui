import { decryptString } from "@govtechsg/oa-encryption";
import { v2, WrappedDocument } from "@govtechsg/open-attestation";

export interface Action {
  type: string;
  payload?: {
    uri?: string;
    key?: string;
  };
}

export const retrieveDocument = async (action: Action): Promise<WrappedDocument<v2.OpenAttestationDocument>> => {
  console.log("action.type", action.type);

  if (action.type === "DOCUMENT") {
    const { uri = "", key } = action?.payload ?? {};
    let certificate = await window.fetch(uri).then((response) => {
      if (response.status >= 400 && response.status < 600) {
        throw new Error(`Unable to load the certificate from ${uri}`);
      }
      return response.json();
    });
    certificate = certificate.document || certificate; // opencerts-function returns the document in a nested document object

    if (!certificate) {
      throw new Error(`Certificate at address ${uri} is empty`);
    }
    // if there is a key and the type is "OPEN-ATTESTATION-TYPE-1", let's use oa-encryption
    if (key && certificate.type === "OPEN-ATTESTATION-TYPE-1") {
      certificate = JSON.parse(
        decryptString({
          tag: certificate.tag,
          cipherText: certificate.cipherText,
          iv: certificate.iv,
          key,
          type: certificate.type,
        })
      );
    } else if (key || certificate.type) {
      throw new Error(`Unable to decrypt certificate with key=${key} and type=${certificate.type}`);
    }
    return certificate;
  } else {
    throw new Error(`The type ${action.type} provided from the action is not supported`);
  }
};
