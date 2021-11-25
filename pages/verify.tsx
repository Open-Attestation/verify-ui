import styled from "@emotion/styled";
import { isValid } from "@govtechsg/oa-verify";
import { getData, v2, WrappedDocument } from "@govtechsg/open-attestation";
import { useRouter } from "next/router";
import queryString from "query-string";
import { useEffect, useLayoutEffect, useState } from "react";
import { CheckCircle, Loader } from "../src/components/shared/icons";
import { Section, Separator } from "../src/components/shared/layout";
import { NavigationBar } from "../src/components/shared/navigation-bar";
import { DropZone } from "../src/components/verify/dropzone";
import { verify } from "../src/issuers-verifier";
import { retrieveDocument } from "../src/services/retrieve-document";
import { Status, Anchor } from "../src/types";
import dynamic from "next/dynamic";
const DocumentRenderer = dynamic(
  () => import("../src/components/verify/document-renderer"),
  {
    ssr: false,
  }
);

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
    <span className={`${className} flex flex-wrap items-center`} data-testid="status-check">
      {status === Status.PENDING && (
        <>
          <Loader className="text-center w-6 mr-1" />
          <p className="w-auto mb-0">{loadingMessage}</p>
        </>
      )}
      {status === Status.RESOLVED && (
        <>
          <CheckCircle className="text-center w-6 mr-1" />
          <p className="w-auto mb-0">{successMessage}</p>
        </>
      )}
      {status === Status.REJECTED && (
        <>
          <i className="text-center text-2xl w-6 mr-1 fas fa-times" style={{ color: "tomato" }} />
          <p className="w-auto mb-0">{errorMessage}</p>
        </>
      )}
    </span>
  );
};

export const VerifyPage: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState<WrappedDocument<v2.OpenAttestationDocument>>();
  const [issuer, setIssuer] = useState("");
  // set overall status to idle and set the rest to pending
  const [loadDocumentStatus, setLoadDocumentStatus] = useState(Status.IDLE);
  const [loadDocumentError, setLoadDocumentError] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(Status.IDLE);
  const [issuerStatus, setIssuerStatus] = useState(Status.PENDING);
  const [issuingStatus, setIssuingStatus] = useState(Status.PENDING);
  const [tamperedStatus, setTamperedStatus] = useState(Status.PENDING);
  const router = useRouter();

  // use layout effect to run this as soon as possible otherwise the dropzone might be displayed before disappearing
  useLayoutEffect(() => {
    const anchorStr = decodeURIComponent(window.location.hash.substr(1));
    const anchor: Anchor = anchorStr === "" ? {} : JSON.parse(anchorStr);
    const query = router.asPath.replace(router.pathname, "");

    const run = async () => {
      try {
        if (query) {
          const parsedSearch = queryString.parse(location.search);
          if (typeof parsedSearch.q !== "string") {
            return;
          }
          const action = JSON.parse(window.decodeURIComponent(parsedSearch.q));

          setLoadDocumentStatus(Status.PENDING);
          const WAIT = 600;
          const [wrappedDocument] = await Promise.all([retrieveDocument(action, anchor), wait(WAIT)]);
          setLoadDocumentStatus(Status.RESOLVED);
          setRawDocument(wrappedDocument);
        }
      } catch (error) {
        setLoadDocumentStatus(Status.REJECTED);
        setLoadDocumentError(
          error.message.includes("Unexpected token")
            ? "The URL is malformed. The document could not be loaded"
            : error.message
        );
      }
    };
    run();
  }, [router]);

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
        const verificationFragment = await verify(rawDocument, (promises) => {
          const [
            hashStatus,
            tokenRegistryStatus,
            documentStoreStatus,
            didSignedStatus,
            dnsTxtIdentity,
            didDnsIdentity,
            allowedIssuerIdentity,
          ] = promises;
          const WAIT = 600;

          Promise.all([wait(WAIT), hashStatus]).then(([, ...verificationFragments]) => {
            setTamperedStatus(
              isValid(verificationFragments, ["DOCUMENT_INTEGRITY"]) ? Status.RESOLVED : Status.REJECTED
            );
          });
          Promise.all([wait(WAIT), documentStoreStatus, tokenRegistryStatus, didSignedStatus]).then(
            ([, ...verificationFragments]) => {
              setIssuingStatus(isValid(verificationFragments, ["DOCUMENT_STATUS"]) ? Status.RESOLVED : Status.REJECTED);

              if (isValid(verificationFragments, ["DOCUMENT_STATUS"])) {
                setIssuer(document.issuers.map((issuer) => issuer.identityProof?.location).join(","));
              }
            }
          );
          Promise.all([wait(WAIT), dnsTxtIdentity, allowedIssuerIdentity, didDnsIdentity]).then(
            ([, ...verificationFragments]) => {
              setIssuerStatus(isValid(verificationFragments, ["ISSUER_IDENTITY"]) ? Status.RESOLVED : Status.REJECTED);
            }
          );
        });
        setVerificationStatus(isValid(verificationFragment) ? Status.RESOLVED : Status.REJECTED);
      }
    };
    setStatusAsync();
  }, [rawDocument]);

  const showDropzone = loadDocumentStatus !== Status.PENDING;
  return (
    <Section>
      <NavigationBar
        onVerifyLinkClicked={() => {
          setVerificationStatus(Status.IDLE);
          setLoadDocumentStatus(Status.IDLE);
          setLoadDocumentError("");
        }}
      />
      <Separator />
      {verificationStatus === Status.IDLE && (
        <>
          <div className="container py-4 text-center">
            <div className="flex flex-wrap">
              <div className="w-full">
                <h2>Verify Documents</h2>
                {showDropzone && <p className="mb-0">Drop a government issued certificate</p>}
              </div>
            </div>
          </div>
          <div className="container">
            {loadDocumentStatus === Status.PENDING && (
              <div
                className="bg-blue-100 border-t-4 border-blue-500 text-blue-700 p-4 w-full text-center mb-4 break-all"
                role="alert"
              >
                <Loader /> Loading document from action
              </div>
            )}
            {loadDocumentStatus === Status.REJECTED && (
              <div
                className="bg-red-100 border-t-4 border-red-500 text-red-700 p-4 w-full text-center break-all"
                role="alert"
              >
                {loadDocumentError}
              </div>
            )}
            {showDropzone && (
              <div className="flex flex-wrap">
                <DropzoneContainer className="w-full lg:w-1/2 lg:mx-auto">
                  <DropZone
                    onDocumentDropped={(document) => {
                      setRawDocument(document as WrappedDocument<v2.OpenAttestationDocument>);
                    }}
                  />
                </DropzoneContainer>
              </div>
            )}
          </div>
        </>
      )}
      {verificationStatus !== Status.IDLE && (
        <div className="container py-4">
          {issuer && (
            <div className="flex flex-wrap mb-4">
              <div className="w-full">
                <h2>
                  Issued by <Issuer>{issuer}</Issuer>
                </h2>
              </div>
            </div>
          )}
          <div className="flex flex-wrap mb-10">
            <div className="w-full mb-1 lg:w-auto lg:mb-0 lg:mr-16">
              <CheckStatus
                status={issuingStatus}
                loadingMessage="Checking if document was issued"
                successMessage="Document has been issued"
                errorMessage="Document has not been issued"
              />
            </div>
            <div className="w-full mb-1 lg:w-auto lg:mb-0 lg:mr-16">
              <CheckStatus
                status={tamperedStatus}
                loadingMessage="Checking if document has been tampered"
                successMessage="Document has not been tampered"
                errorMessage="Document has been tampered"
              />
            </div>
            <div className="w-full mb-1 lg:w-auto lg:mb-0 lg:mr-16">
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

export default VerifyPage;
