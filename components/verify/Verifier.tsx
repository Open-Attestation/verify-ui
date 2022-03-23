import React, { useState, useEffect } from "react";
import { utils, v2, v3 } from "@govtechsg/open-attestation";
import { isValid } from "@govtechsg/oa-verify";

import { VerificationStatus } from "@types";
import { getDataV2OrV3 } from "@utils/oa-details";
import Heading from "@components/text/Heading";
import Renderer from "@components/figure/Renderer";
import VerificationChecks, { VerificationChecksProps, CustomMessageProps } from "@components/figure/VerificationChecks";
import { apiVerifyWithFallback } from "@utils/oa-api-verify";
import { isHealthCert } from "@utils/notarise-healthcerts";

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
      } else {
        setVerificationStatus("REJECTED");
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

      if (isHealthCert(document)) {
        setCustomMessage({
          ISSUER_IDENTITY: {
            VERIFIED: "Issued by Singapore Government",
            REJECTED: "Document not issued by Singapore Government",
          },
        });
      } else {
        setCustomMessage(undefined);
      }
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
      {verificationStatus === "VERIFIED" && <Renderer document={getDataV2OrV3(wrappedDocument)} />}
    </section>
  );
};

export default Verifier;
