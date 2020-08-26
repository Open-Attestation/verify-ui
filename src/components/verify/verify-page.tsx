import styled from "@emotion/styled";
import { isValid, verify } from "@govtechsg/oa-verify";
import { getData, v2, WrappedDocument } from "@govtechsg/open-attestation";
import React, { useEffect, useState } from "react";
import { CheckCircle, Loader } from "../shared/icons";
import { Section, Separator } from "../shared/layout";
import { NavigationBar } from "../shared/navigation-bar";
import { Status } from "./../../types";
import { DocumentRenderer } from "./document-renderer";
import { DropZone } from "./dropzone";

const NETWORK_NAME = process.env.REACT_APP_NETWORK_NAME || "ropsten";

const DropzoneContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 46px;
`;
const Issuer = styled.span`
  color: var(--primary);
  word-break: break-word;
`;

const wait = (time: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, time));

const CheckStatus: React.FunctionComponent<{
  status: Status;
  loadingMessage: string;
  successMessage: string;
  errorMessage: string;
  className?: string;
}> = ({ status, loadingMessage, successMessage, errorMessage, className = "" }) => {
  return (
    <span className={`inline-flex ${className} items-center`} data-testid="status-check">
      {status === Status.PENDING && (
        <>
          <Loader className="mr-1" /> {loadingMessage}
        </>
      )}
      {status === Status.RESOLVED && (
        <>
          <CheckCircle className="mr-1" /> {successMessage}
        </>
      )}
      {status === Status.REJECTED && (
        <>
          <i style={{ color: "tomato" }} className="fas fa-skull-crossbones mr-1" /> {errorMessage}
        </>
      )}
    </span>
  );
};

export const VerifyPage: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState<WrappedDocument>();
  const [issuer, setIssuer] = useState("");
  // set overall status to idle and set the rest to pending
  const [verificationStatus, setVerificationStatus] = useState<Status>(Status.IDLE);
  const [issuerStatus, setIssuerStatus] = useState(Status.PENDING);
  const [issuingStatus, setIssuingStatus] = useState(Status.PENDING);
  const [tamperedStatus, setTamperedStatus] = useState(Status.PENDING);

  useEffect(() => {
    // to unset previous verifying statuses (if any), issuer's name when verifying another document
    setIssuer("");
    setIssuerStatus(Status.PENDING);
    setIssuingStatus(Status.PENDING);
    setTamperedStatus(Status.PENDING);

    const setStatusAsync = async (): Promise<void> => {
      if (rawDocument) {
        setVerificationStatus(Status.PENDING);
        const document: v2.OpenAttestationDocument = getData(rawDocument);
        const verificationFragment = await verify(rawDocument, {
          network: NETWORK_NAME,
          promisesCallback: (promises) => {
            const HASH_STATUS_INDEX = 0;
            const TOKEN_REGISTRY_STATUS_INDEX = 2;
            const DOCUMENT_STORE_STATUS_INDEX = 3;
            const DNS_TXT_VERIFIER_INDEX = 4;
            const WAIT = 1000;

            Promise.all([promises[HASH_STATUS_INDEX], wait(WAIT)]).then(([fragment]) => {
              setTamperedStatus(isValid([fragment], ["DOCUMENT_INTEGRITY"]) ? Status.RESOLVED : Status.REJECTED);
            });
            Promise.all([
              promises[DOCUMENT_STORE_STATUS_INDEX],
              promises[TOKEN_REGISTRY_STATUS_INDEX],
              wait(WAIT),
            ]).then(([documentStoreFragment, tokenRegistryFragment]) => {
              setIssuingStatus(
                isValid([documentStoreFragment, tokenRegistryFragment], ["DOCUMENT_STATUS"])
                  ? Status.RESOLVED
                  : Status.REJECTED
              );

              if (isValid([documentStoreFragment, tokenRegistryFragment], ["DOCUMENT_STATUS"])) {
                setIssuer(document.issuers.map((issuer) => issuer.identityProof?.location).join(","));
              }
            });
            Promise.all([promises[DNS_TXT_VERIFIER_INDEX], wait(WAIT)]).then(([fragment]) => {
              setIssuerStatus(isValid([fragment], ["ISSUER_IDENTITY"]) ? Status.RESOLVED : Status.REJECTED);
            });
          },
        });
        setVerificationStatus(isValid(verificationFragment) ? Status.RESOLVED : Status.REJECTED);
      }
    };
    setStatusAsync();
  }, [rawDocument]);

  return (
    <Section>
      <NavigationBar onVerifyLinkClicked={() => setVerificationStatus(Status.IDLE)} />
      <Separator />
      {verificationStatus === Status.IDLE && (
        <>
          <h2 className="text-center my-2">Verify Documents</h2>
          <p className="text-center">Drop a government issued certificate</p>
          <div className="container px-4">
            <div className="flex flex-wrap">
              <DropzoneContainer className="w-full lg:w-1/2 lg:mx-auto">
                <DropZone
                  onDocumentDropped={(document) => {
                    setRawDocument(document);
                  }}
                />
              </DropzoneContainer>
            </div>
          </div>
        </>
      )}
      {verificationStatus !== Status.IDLE && (
        <div className="container px-4">
          {issuer && (
            <div className="flex flex-wrap mb-4">
              <div className="w-full">
                <h2>
                  Issued by <Issuer>{issuer}</Issuer>
                </h2>
              </div>
            </div>
          )}
          <div className="flex flex-wrap mb-8">
            <div className="w-full lg:w-auto">
              <CheckStatus
                status={issuingStatus}
                loadingMessage="Checking if document was issued"
                successMessage="Document has been issued"
                errorMessage="Document has not been issued"
                className="mr-16"
              />
            </div>
            <div className="w-full lg:w-auto">
              <CheckStatus
                status={tamperedStatus}
                loadingMessage="Checking if document has been tampered"
                successMessage="Document has not been tampered"
                errorMessage="Document has been tampered"
                className="mr-16"
              />
            </div>
            <div className="w-full lg:w-auto">
              <CheckStatus
                status={issuerStatus}
                loadingMessage="Checking issuer identity"
                successMessage="Document’s issuer has been identified"
                errorMessage="Document’s issuer has not been identified"
              />
            </div>
          </div>
          {verificationStatus === Status.RESOLVED && rawDocument && <DocumentRenderer rawDocument={rawDocument} />}
        </div>
      )}
    </Section>
  );
};
