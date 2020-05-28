import { WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState } from "react";
import { DocumentRenderer } from "../components/document-renderer";
import { DropZone } from "../components/dropzone";

export const HomePage: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState<WrappedDocument>();
  const [documentStatus, setDocumentStatus] = useState<boolean>();

  const statusBanner = (verified: boolean): React.ReactElement => {
    const bannerColor = verified ? "bg-green-200" : "bg-red-300";
    const textColor = verified ? "text-green-600" : "text-red-600";
    return (
      <div className={`w-full text-center py-3 ${bannerColor}`}>
        <p className={`${textColor} font-medium`}>Verifiable Credential is {verified ? "valid" : "invalid"}</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-100">
      <DropZone setRawDocument={(doc) => setRawDocument(doc)} setDocumentStatus={(bool) => setDocumentStatus(bool)} />
      {documentStatus !== undefined && statusBanner(documentStatus)}
      {rawDocument ? <DocumentRenderer rawDocument={rawDocument} /> : null}
    </div>
  );
};
