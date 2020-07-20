import { verify, isValid } from "@govtechsg/oa-verify";
import { WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState, useEffect } from "react";

import { DemoDocument } from "../components/demo-document";
import { DocumentRenderer } from "../components/document-renderer";
import { DropZone } from "../components/dropzone";

enum Status {
  IDLE,
  PENDING,
  RESOLVED,
  REJECTED,
}

export const VerifyPage: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState<WrappedDocument>();
  const [documentStatus, setDocumentStatus] = useState<Status>(Status.IDLE);
  const NETWORK_NAME = process.env.REACT_APP_NETWORK_NAME || "ropsten";

  useEffect(() => {
    const setStatusAsync = async (): Promise<void> => {
      setDocumentStatus(Status.PENDING);

      if (rawDocument) {
        isValid(await verify(rawDocument, { network: NETWORK_NAME }))
          ? setDocumentStatus(Status.RESOLVED)
          : setDocumentStatus(Status.REJECTED);
      }
    };
    setStatusAsync();
  }, [rawDocument, NETWORK_NAME]);

  return (
    <div className="bg-gray-100">
      <div className="flex">
        <DemoDocument onDocumentLoaded={(document) => setRawDocument(document)} />
        <DropZone onDocumentDropped={(document) => setRawDocument(document)} />
      </div>
      {documentStatus === Status.RESOLVED ? (
        <div className="w-full text-center py-3 bg-green-200">
          <p className="text-green-600 font-medium">Verifiable Credential is valid</p>
        </div>
      ) : documentStatus === Status.REJECTED ? (
        <div className="w-full text-center py-3 bg-red-300">
          <p className="text-red-600 font-medium">Verifiable Credential is invalid</p>
        </div>
      ) : null}
      {documentStatus === Status.RESOLVED && rawDocument ? (
        <DocumentRenderer rawDocument={rawDocument as WrappedDocument} key={rawDocument.data.id as string} />
      ) : null}
    </div>
  );
};
