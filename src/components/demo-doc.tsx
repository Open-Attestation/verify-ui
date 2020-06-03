import { WrappedDocument } from "@govtechsg/open-attestation";
import React from "react";
import ROPSTEN_DEMO from "./demo-ropsten.json";

interface DemoDocProps {
  setRawDocument: (doc: WrappedDocument) => void;
}

export const DemoDoc: React.FunctionComponent<DemoDocProps> = ({ setRawDocument }: DemoDocProps) => {
  const onClick = (): void => {
    const json = JSON.parse(JSON.stringify(ROPSTEN_DEMO));
    setRawDocument(json);
  };
  return (
    <button className="w-64 p-16 border-gray-500 border-solid border-4 text-gray-700" onClick={onClick}>
      Click here to test with a demo certificate
    </button>
  );
};
