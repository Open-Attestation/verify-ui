import {
  openAttestationVerifiers,
  verificationBuilder,
  VerificationFragmentType,
  VerificationManagerOptions,
  Verifier,
  CodedError,
} from "@govtechsg/oa-verify";
import { getData, SignedWrappedDocument, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";

export enum VerifyAllowedIssuersCode {
  UNEXPECTED_ERROR = 0,
  INVALID_IDENTITY = 1,
  SKIPPED = 2,
  UNSUPPORTED_V3_DOCUMENT = 3,
}

const name = "VerifyAllowedIssuers";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
const isWrappedV2Document = (document: any): document is WrappedDocument<v2.OpenAttestationDocument> => {
  return document.data && document.data.issuers;
};
const whitelistedIssuers = ["gov.sg", "openattestation.com"];
export const isWhitelisted = (identity: string): boolean => {
  return (
    whitelistedIssuers.some((issuer) => identity.toLowerCase().endsWith(`.${issuer}`)) ||
    whitelistedIssuers.includes(identity.toLowerCase())
  );
};
export const verifyAllowedIssuers: Verifier<
  | WrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v3.OpenAttestationDocument>
  | SignedWrappedDocument<v2.OpenAttestationDocument>,
  VerificationManagerOptions,
  Array<string | undefined>
> = {
  skip: () => {
    throw new Error("This verifier is never skipped");
  },
  test: () => {
    return true;
  },
  verify: async (document) => {
    try {
      if (isWrappedV2Document(document)) {
        const documentData = getData(document);
        const identities = documentData.issuers.map((issuer) => issuer.identityProof?.location);
        // every issuers must be whitelisted
        const valid =
          identities.length > 0 && identities.every((identity) => (identity ? isWhitelisted(identity) : false));
        return {
          name,
          type,
          data: identities,
          status: valid ? "VALID" : "INVALID",
          ...(valid
            ? {}
            : {
                reason: {
                  code: VerifyAllowedIssuersCode.INVALID_IDENTITY,
                  codeString: VerifyAllowedIssuersCode[VerifyAllowedIssuersCode.INVALID_IDENTITY],
                  message: `No issuers allowed by this platform found. Valid issuers are ${whitelistedIssuers.join(
                    ","
                  )}`,
                },
              }),
        };
      }
      throw new CodedError(
        "Verify does not support v3 document",
        VerifyAllowedIssuersCode.UNSUPPORTED_V3_DOCUMENT,
        VerifyAllowedIssuersCode[VerifyAllowedIssuersCode.UNSUPPORTED_V3_DOCUMENT]
      );
    } catch (e) {
      return {
        name,
        type,
        data: e,
        reason: {
          code: e.code || VerifyAllowedIssuersCode.UNEXPECTED_ERROR,
          codeString: e.codeString || VerifyAllowedIssuersCode[VerifyAllowedIssuersCode.UNEXPECTED_ERROR],
          message: e.message,
        },
        status: "ERROR",
      };
    }
  },
};

export const verify = verificationBuilder<
  | SignedWrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v3.OpenAttestationDocument>
>([...openAttestationVerifiers, verifyAllowedIssuers]);
