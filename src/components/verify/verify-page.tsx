import styled from "@emotion/styled";
import { isValid, verify } from "@govtechsg/oa-verify";
import { getData, v2, WrappedDocument } from "@govtechsg/open-attestation";
import React, { useEffect, useState } from "react";
import { CheckCircle, Loader } from "../shared/icons";
import { NavigationBar } from "../shared/navigation-bar";
import { DocumentRenderer } from "./document-renderer";
import { DropZone } from "./dropzone";

const NETWORK_NAME = process.env.REACT_APP_NETWORK_NAME || "ropsten";

enum Status {
  IDLE,
  PENDING,
  RESOLVED,
  REJECTED,
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > * {
    max-width: 1280px;
    width: 1280px;
  }
  background: #faf9fb;
`;
const Separator = styled.hr`
  border: 1px solid #eeecf1;
  margin: 10px 0;
`;

const Title = styled.div`
  font-family: Manjari;
  font-weight: bold;
  font-size: 42px;
  line-height: 49px;
  color: #5b5e62;
`;
const SubTitle = styled.div`
  text-align: center;
  color: #434144;
`;

const DropzoneContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 46px;
`;
const Issuer = styled.span`
  color: var(--primary);
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
    <span className={`inline-flex ${className} items-center`}>
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
  const [revokingStatus, setRevokingStatus] = useState(Status.PENDING);

  useEffect(() => {
    const setStatusAsync = async (): Promise<void> => {
      if (rawDocument) {
        setVerificationStatus(Status.PENDING);
        const document: v2.OpenAttestationDocument = getData(rawDocument);
        setIssuer(document.issuers.map((issuer) => issuer.identityProof?.location).join(","));
        const verificationFragment = await verify(rawDocument, {
          network: NETWORK_NAME,
          promisesCallback: (promises) => {
            const DOCUMENT_STORE_ISSUED_VERIFIER_INDEX = 2;
            const TOKEN_REISTRY_MINTED_VERIFIER_INDEX = 3;
            const DOCUMENT_STORE_REVOKED_VERIFIER_INDEX = 4;
            const DNS_TXT_VERIFIER_INDEX = 5;
            const WAIT = 1000;

            Promise.all([promises[DNS_TXT_VERIFIER_INDEX], wait(WAIT)]).then(([fragment]) => {
              setIssuerStatus(isValid([fragment], ["ISSUER_IDENTITY"]) ? Status.RESOLVED : Status.REJECTED);
            });
            Promise.all([promises[DOCUMENT_STORE_REVOKED_VERIFIER_INDEX], wait(WAIT)]).then(([fragment]) => {
              setRevokingStatus(isValid([fragment], ["DOCUMENT_STATUS"]) ? Status.RESOLVED : Status.REJECTED);
            });
            Promise.all([
              promises[DOCUMENT_STORE_ISSUED_VERIFIER_INDEX],
              promises[TOKEN_REISTRY_MINTED_VERIFIER_INDEX],
              wait(WAIT),
            ]).then(([documentStoreFragment, tokenRegistryFragment]) => {
              setIssuingStatus(
                isValid([documentStoreFragment, tokenRegistryFragment], ["DOCUMENT_STATUS"])
                  ? Status.RESOLVED
                  : Status.REJECTED
              );
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
      <NavigationBar />
      <Separator />
      {verificationStatus === Status.IDLE && (
        <>
          <Title className="text-center">Verify Documents</Title>
          <SubTitle>Drop a government issued certificate</SubTitle>
          <DropzoneContainer className="flex justify-center">
            <DropZone
              onDocumentDropped={(document) => {
                setRawDocument(document);
              }}
            />
          </DropzoneContainer>
        </>
      )}
      {verificationStatus !== Status.IDLE && (
        <>
          <Title>
            Issued by <Issuer>{issuer}</Issuer>
          </Title>
          <div className="mb-8 flex items-center">
            <CheckStatus
              status={issuingStatus}
              loadingMessage="Checking if document was issued"
              successMessage="Document has been issued"
              errorMessage="Document has not been issued"
              className="mr-16"
            />
            <CheckStatus
              status={revokingStatus}
              loadingMessage="Checking if document was revoked"
              successMessage="Document has not been revoked"
              errorMessage="Document has been revoked"
              className="mr-16"
            />
            <CheckStatus
              status={issuerStatus}
              loadingMessage="Checking issuer identity"
              successMessage="Document’s issuer has been identified"
              errorMessage="Document’s issuer has not been identified"
            />
          </div>
          {verificationStatus === Status.RESOLVED && rawDocument && <DocumentRenderer rawDocument={rawDocument} />}
        </>
      )}
    </Section>
  );
};
