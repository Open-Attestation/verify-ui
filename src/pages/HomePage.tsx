import { WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState } from "react";
import { DocumentRenderer } from "../components/DocumentRenderer";
import { DropZone } from "../components/DropZone";

export const HomePage: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState<WrappedDocument>();

  return (
    <div className="bg-gray-100">
      <h1 className="mb-20 text-xl">Home page</h1>
      <DropZone setRawDocument={(doc) => setRawDocument(doc)} />
      {rawDocument ? <DocumentRenderer rawDocument={rawDocument} /> : null}
    </div>
  );
};
