import { WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState } from "react";
import { DocumentRenderer } from "../components/document-renderer";
import { DropZone } from "../components/dropzone";

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const HomePage: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState<WrappedDocument>();
  const uuid = uuidv4();

  return (
    <div className="bg-gray-100">
      <DropZone setRawDocument={(doc) => setRawDocument(doc)} />
      {rawDocument ? <DocumentRenderer key={uuid} rawDocument={rawDocument} /> : null}
    </div>
  );
};
