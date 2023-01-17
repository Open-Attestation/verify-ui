import React, { useState, useEffect } from "react";
import { utils, v2, v3 } from "@govtechsg/open-attestation";
import { isValid, utils as verifyUtils } from "@govtechsg/oa-verify";

import { VerificationStatus } from "@types";
import { getDataV2OrV3 } from "@utils/oa-details";
import Heading from "@components/text/Heading";
import Renderer from "@components/figure/Renderer";
import VerificationChecks, { VerificationChecksProps, CustomMessageProps } from "@components/figure/VerificationChecks";
import { apiVerifyWithFallback } from "@utils/oa-api-verify";
import { isHealthCert } from "@utils/notarise-healthcerts";
import { sendHealthCertVerifiedEvent, sendHealthCertErrorEvent } from "@utils/google-analytics";

const defaultFragVeriStatus: VerificationChecksProps = {
  DOCUMENT_STATUS: "PENDING",
  DOCUMENT_INTEGRITY: "PENDING",
  ISSUER_IDENTITY: "PENDING",
};

interface VerifierProps extends React.HTMLAttributes<HTMLHeadingElement> {
  wrappedDocument: v2.WrappedDocument | v3.WrappedDocument;
}

const Verifier: React.FC<VerifierProps> = ({ wrappedDocument }) => {
  // Overall verification status
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("PENDING");

  // Fragment verification status (3 check marks)
  const [fragmentVerificationStatus, setFragmentVerificationStatus] = useState(defaultFragVeriStatus);
  const [customMessage, setCustomMessage] = useState<CustomMessageProps["customMessage"]>();

  // Unwrapped document and details
  const [issuerDomain, setIssuerDomain] = useState("");

  useEffect(() => {
    (async () => {
      setVerificationStatus("PENDING");
      setFragmentVerificationStatus(defaultFragVeriStatus);

      const fragments = await apiVerifyWithFallback(wrappedDocument);
      const isValidFragments = isValid(fragments);
      const document = getDataV2OrV3(wrappedDocument);

      if (isValidFragments) {
        setVerificationStatus("VERIFIED");
        sendHealthCertVerifiedEvent(document);
      } else {
        setVerificationStatus("REJECTED");
        sendHealthCertErrorEvent(document, fragments);
      }

      if (utils.isRawV2Document(document)) {
        setIssuerDomain(document.issuers.map((issuer) => issuer.identityProof?.location).join(","));
      } else {
        setIssuerDomain(typeof document.issuer === "object" ? document.issuer.name : document.issuer);
      }

      // 1. Document issue status (Was it issued?)
      const DOCUMENT_STATUS = isValid(fragments, ["DOCUMENT_STATUS"]) ? "VERIFIED" : "REJECTED";

      // 2. Document integrity (Was it tampered?)
      const DOCUMENT_INTEGRITY = isValid(fragments, ["DOCUMENT_INTEGRITY"]) ? "VERIFIED" : "REJECTED";

      // 3. Document issuer identity (Published DNS TXT records and whitelisted issuer?)
      const ISSUER_IDENTITY = isValid(fragments, ["ISSUER_IDENTITY"]) ? "VERIFIED" : "REJECTED";

      setFragmentVerificationStatus({ DOCUMENT_STATUS, DOCUMENT_INTEGRITY, ISSUER_IDENTITY });

      const invalidFragments = fragments.filter((fragment) => verifyUtils.isInvalidFragment(fragment));

      // [Mutually exclusive] A document is either:
      const invalidDocStatusFragment =
        // Issued onto Ethereum document store; or
        verifyUtils.getOpenAttestationEthereumDocumentStoreStatusFragment(invalidFragments) ||
        // Signed (issued) with a DID
        verifyUtils.getOpenAttestationDidSignedDocumentStatusFragment(invalidFragments);

      const isRevoked =
        invalidDocStatusFragment?.data.revokedOnAny === true &&
        (invalidDocStatusFragment?.reason?.message.includes("has been revoked under contract") || // Revoked via document store. Ideally should check via reason code. However, oa-verify always falls back to code 5 for all other errors (e.g. Contract is not found): https://github.com/Open-Attestation/oa-verify/blob/9638ba5285dc85fc294283c5e5e531debaaa5c4b/src/verifiers/documentStatus/utils.ts#L119-L123
          invalidDocStatusFragment?.reason?.message.includes("has been revoked under OCSP Responder")); // Revoked via OCSP Responder v2. Ideally should check via reason code. However, oa-verify utilises this field for the 0-10 OCSP Revocation reason code (not to be confused with OA status code): https://github.com/Open-Attestation/oa-verify/blob/9638ba5285dc85fc294283c5e5e531debaaa5c4b/src/verifiers/documentStatus/revocation.types.ts#L27-L38

      let customMessage: CustomMessageProps["customMessage"] = {};

      if (isRevoked) {
        customMessage = {
          ...customMessage,
          DOCUMENT_STATUS: {
            REJECTED: "Document has been revoked",
          },
        };
      }

      if (isHealthCert(document)) {
        customMessage = {
          ...customMessage,
          ISSUER_IDENTITY: {
            VERIFIED: "Issued by Singapore Government",
            REJECTED: "Document not issued by Singapore Government",
          },
        };
      }

      setCustomMessage(customMessage);
    })();
  }, [wrappedDocument]);

  return (
    <section className="container my-10">
      {issuerDomain && (
        <Heading level="h1" className="text-4xl font-bold break-words">
          Issued by <span className="text-primary">{issuerDomain}</span>
        </Heading>
      )}

      <VerificationChecks {...fragmentVerificationStatus} customMessage={customMessage} />
      {verificationStatus === "VERIFIED" && (
        <Renderer document={getDataV2OrV3(wrappedDocument)} rawDocument={wrappedDocument} />
      )}
    </section>
  );
};

export default Verifier;
