import { WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState } from "react";
import { DocumentRenderer } from "../components/document-renderer";
import { DropZone } from "../components/dropzone";

export const HomePage: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState<WrappedDocument>();

  return (
    <div className="bg-gray-100">
      <DropZone setRawDocument={(doc) => setRawDocument(doc)} />
      {rawDocument ? <DocumentRenderer rawDocument={rawDocument} /> : null}
    </div>
  );
};
