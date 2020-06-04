import { WrappedDocument } from "@govtechsg/open-attestation";
import React from "react";
import ROPSTEN_DEMO from "./ropsten-demo.json";

interface DemoDocumentProps {
  onDocumentLoaded: (document: WrappedDocument) => void;
}

export const DemoDocument: React.FunctionComponent<DemoDocumentProps> = ({ onDocumentLoaded }: DemoDocumentProps) => {
  const onClick = (): void => {
    onDocumentLoaded(JSON.parse(JSON.stringify(ROPSTEN_DEMO)));
  };

  return (
    <button className="w-64 p-16 border-gray-500 border-solid border-4 text-gray-700" onClick={onClick}>
      Click here to test with a demo certificate
    </button>
  );
};
