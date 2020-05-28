import { verify, isValid } from "@govtechsg/oa-verify";
import { WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState, useEffect } from "react";

import { DocumentRenderer } from "../components/document-renderer";
import { DropZone } from "../components/dropzone";

export const HomePage: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState<WrappedDocument>();
  const [documentStatus, setDocumentStatus] = useState<boolean>();

  useEffect(() => {
    const setStatusAsync = async (): Promise<void> => {
      if (rawDocument) {
        setDocumentStatus(isValid(await verify(rawDocument, { network: "homestead" })));
      }
    };
    setStatusAsync();
  }, [rawDocument]);

  return (
    <div className="bg-gray-100">
      <DropZone setRawDocument={(doc) => setRawDocument(doc)} setDocumentStatus={(bool) => setDocumentStatus(bool)} />
      {documentStatus !== undefined &&
        (documentStatus ? (
          <div className="w-full text-center py-3 bg-green-200">
            <p className="text-green-600 font-medium">Verifiable Credential is valid</p>
          </div>
        ) : (
          <div className="w-full text-center py-3 bg-red-300">
            <p className="text-red-600 font-medium">Verifiable Credential is invalid</p>
          </div>
        ))}
      {documentStatus ? <DocumentRenderer rawDocument={rawDocument as WrappedDocument} /> : null}
    </div>
  );
};
