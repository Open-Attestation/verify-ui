import {
  openAttestationVerifiers,
  verificationBuilder,
  VerificationFragmentType,
  Verifier,
  CodedError,
  ValidVerificationFragment,
  InvalidVerificationFragment,
  ErrorVerificationFragment,
  SkippedVerificationFragment,
} from "@govtechsg/oa-verify";
import { getData, utils } from "@govtechsg/open-attestation";

type AllowedIssuersValidFragment = ValidVerificationFragment<Array<string | undefined>>;
type AllowedIssuersInvalidFragment = InvalidVerificationFragment<Array<string | undefined>>;
type AllowedIssuersErrorFragment = ErrorVerificationFragment<any>;

type AllowedIssuersFragment =
  | AllowedIssuersValidFragment
  | AllowedIssuersErrorFragment
  | AllowedIssuersInvalidFragment
  | SkippedVerificationFragment;

type VerifierType = Verifier<AllowedIssuersFragment>;

export enum VerifyAllowedIssuersCode {
  UNEXPECTED_ERROR = 0,
  INVALID_IDENTITY = 1,
  SKIPPED = 2,
  UNSUPPORTED_V3_DOCUMENT = 3,
}

const name = "VerifyAllowedIssuers";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
const whitelistedIssuers = ["gov.sg", "openattestation.com"];
export const isWhitelisted = (identity: string): boolean => {
  return (
    whitelistedIssuers.some((issuer) => identity.toLowerCase().endsWith(`.${issuer}`)) ||
    whitelistedIssuers.includes(identity.toLowerCase())
  );
};

const skip: VerifierType["skip"] = () => {
  throw new Error("This verifier is never skipped");
};

const test: VerifierType["test"] = () => {
  return true;
};

const verifyMethod: VerifierType["verify"] = async (document) => {
  try {
    if (utils.isWrappedV2Document(document)) {
      const documentData = getData(document);
      const identities = documentData.issuers.map((issuer) => issuer.identityProof?.location);
      // every issuers must be whitelisted
      const valid =
        identities.length > 0 && identities.every((identity) => (identity ? isWhitelisted(identity) : false));
      if (!valid) {
        return {
          name,
          type,
          data: identities,
          status: "INVALID" as const,
          reason: {
            code: VerifyAllowedIssuersCode.INVALID_IDENTITY,
            codeString: VerifyAllowedIssuersCode[VerifyAllowedIssuersCode.INVALID_IDENTITY],
            message: `No issuers allowed by this platform found. Valid issuers are ${whitelistedIssuers.join(",")}`,
          },
        };
      }
      return {
        name,
        type,
        data: identities,
        status: "VALID" as const,
      };
    }
    // TODO: support for V3 is available now
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
      status: "ERROR" as const,
    };
  }
};

export const verifyAllowedIssuers: VerifierType = {
  skip,
  test,
  verify: verifyMethod,
};
const NETWORK_NAME = process.env.REACT_APP_NETWORK_NAME || "ropsten";
process.env.INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;
export const verify = verificationBuilder([...openAttestationVerifiers, verifyAllowedIssuers], {
  network: NETWORK_NAME,
});
