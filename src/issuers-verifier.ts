import {
  openAttestationVerifiers,
  verificationBuilder,
  VerificationFragmentType,
  VerificationManagerOptions,
  Verifier,
  CodedError,
} from "@govtechsg/oa-verify";
import { getData, SignedWrappedDocument, utils, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";

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
export const verifyAllowedIssuers: Verifier<
  | WrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v3.OpenAttestationDocument>
  | SignedWrappedDocument<v2.OpenAttestationDocument>,
  VerificationManagerOptions,
  Array<string | undefined>
> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: VerifyAllowedIssuersCode.SKIPPED,
        codeString: VerifyAllowedIssuersCode[VerifyAllowedIssuersCode.SKIPPED],
        message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use ${v3.IdentityProofType.DNSTxt} type`,
      },
    });
  },
  test: (document) => {
    if (isWrappedV2Document(document)) {
      const documentData = getData(document);
      // at least one issuer uses DNS-TXT
      return documentData.issuers.some((issuer) => {
        return (
          (issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore) &&
          issuer.identityProof?.type === v2.IdentityProofType.DNSTxt
        );
      });
    } else if (utils.isWrappedV3Document(document)) {
      const documentData = getData(document);
      return documentData.issuer.identityProof.type === v3.IdentityProofType.DNSTxt;
    }
    return false;
  },
  verify: async (document) => {
    try {
      if (isWrappedV2Document(document)) {
        const documentData = getData(document);
        const identities = await Promise.all(documentData.issuers.map((issuer) => issuer.identityProof?.location));
        const valid = identities.some((identity) =>
          identity?.match(
            new RegExp(`^.*(${whitelistedIssuers.map((issuer) => issuer.replace(/\./g, "\\.")).join("|")})$`)
          )
        );
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
