import styled from "@emotion/styled";
import { isValid, VerificationFragment } from "@govtechsg/oa-verify";
import { getData, v2, WrappedDocument } from "@govtechsg/open-attestation";
import fetch from "node-fetch";
import queryString from "query-string";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { verify } from "../../issuers-verifier";
import { sendHealthCertErrorEvent, sendHealthCertVerifiedEvent } from "../../services/google-analytics";
import { retrieveDocument } from "../../services/retrieve-document";
import { CheckCircle, Loader } from "../shared/icons";
import { Section, Separator } from "../shared/layout";
import { NavigationBar } from "../shared/navigation-bar";
import { Status, Anchor } from "./../../types";
import { DocumentRenderer } from "./document-renderer";
import { DropZone } from "./dropzone";

const DropzoneContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 46px;
`;
const Issuer = styled.span`
  color: var(--primary);
  word-break: break-word;
`;

const API_VERIFY_URL = process.env.REACT_APP_API_VERIFY_URL || "http://localhost:3000/dev/verify";

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
  const location = useLocation();
  // use layout effect to run this as soon as possible otherwise the dropzone might be displayed before disappearing
  useLayoutEffect(() => {
    const anchorStr = decodeURIComponent(window.location.hash.substr(1));
    const anchor: Anchor = anchorStr === "" ? {} : JSON.parse(anchorStr);
    const run = async () => {
      try {
        if (location.search) {
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
      } catch (error: any) {
        setLoadDocumentStatus(Status.REJECTED);
        setLoadDocumentError(
          error.message.includes("Unexpected token")
            ? "The URL is malformed. The document could not be loaded"
            : error.message
        );
      }
    };
    run();
  }, [location]);

  useEffect(() => {
    // to unset previous verifying statuses (if any), issuer's name when verifying another document
    setIssuer("");
    setIssuerStatus(Status.PENDING);
    setIssuingStatus(Status.PENDING);
    setTamperedStatus(Status.PENDING);

    (async () => {
      if (rawDocument) {
        setVerificationStatus(Status.PENDING);
        const document: v2.OpenAttestationDocument = getData(rawDocument);
        const enc = new TextEncoder();
        const data = enc.encode(JSON.stringify(rawDocument));

        let fragments: VerificationFragment[];
        let isValidFragments: boolean;

        try {
          // Use API Verify
          const apiVerifyResponse = await fetch(API_VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: data,
          });

          if (!apiVerifyResponse.ok) {
            throw new Error("Unsuccessful response from API_VERIFY_URL (api.verify.gov.sg)");
          }

          const parsed = await apiVerifyResponse.json();
          fragments = parsed.fragments;
          isValidFragments = parsed.isValid;
        } catch (e) {
          // Fallback: Use local OA Verify
          fragments = await verify(rawDocument);
          isValidFragments = isValid(fragments);
        }

        const [
          hashStatus,
          tokenRegistryStatus,
          documentStoreStatus,
          didSignedStatus,
          dnsTxtIdentity,
          didDnsIdentity,
          allowedIssuerIdentity,
        ] = fragments;

        const isValidDocumentIntegrity = isValid([hashStatus], ["DOCUMENT_INTEGRITY"]);
        setTamperedStatus(isValidDocumentIntegrity ? Status.RESOLVED : Status.REJECTED);

        const isValidDocumentStatus = isValid(
          [documentStoreStatus, tokenRegistryStatus, didSignedStatus],
          ["DOCUMENT_STATUS"]
        );
        setIssuingStatus(isValidDocumentStatus ? Status.RESOLVED : Status.REJECTED);
        if (isValidDocumentStatus) {
          setIssuer(document.issuers.map((issuer) => issuer.identityProof?.location).join(","));
        }

        const isValidIssuerIdentity = isValid(
          [dnsTxtIdentity, allowedIssuerIdentity, didDnsIdentity],
          ["ISSUER_IDENTITY"]
        );
        setIssuerStatus(isValidIssuerIdentity ? Status.RESOLVED : Status.REJECTED);

        if (isValidFragments) {
          setVerificationStatus(Status.RESOLVED);
          // if document is a healthcert, send event to google analytics
          sendHealthCertVerifiedEvent(document);
        } else {
          setVerificationStatus(Status.REJECTED);
          // if healthcert has verification error, send event to google analytics
          sendHealthCertErrorEvent(document, fragments);
        }
      }
    })();
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
