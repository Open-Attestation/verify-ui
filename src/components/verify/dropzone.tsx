import styled from "@emotion/styled";
import { WrappedDocument } from "@govtechsg/open-attestation";
import React from "react";
import Dropzone from "react-dropzone";
import { ButtonPrimary } from "../shared/button";
import documentImage from "./images/document.svg";

const Container = styled.div`
  background: #ffffff;
  border: 2px dashed #dddddd;
  box-sizing: border-box;
  border-radius: 20px;
  width: 100%;
  min-height: 520px;
  &.hover {
    background: #f0f0f0;
    border-color: var(--primary);
    box-shadow: 0 0 10px 1px var(--accent-2);
  }
`;

interface DropZoneProps {
  onDocumentDropped: (document: WrappedDocument) => void;
}
export const DropZone: React.FunctionComponent<DropZoneProps> = ({ onDocumentDropped }: DropZoneProps) => {
  const onFileDrop = (files: File[]): void => {
    const reader = new FileReader();

    reader.onerror = () => {
      alert(`The file uploaded is not a valid Open Attestation file, error: ${reader.error}`);
    };

    reader.onload = () => {
      try {
        if (reader.result && typeof reader.result === "string") {
          onDocumentDropped(JSON.parse(reader.result));
        } else {
          alert(`The file uploaded is not a valid Open Attestation file`);
        }
      } catch (e) {
        alert(`The file uploaded is not a valid Open Attestation file, error: ${e.message}`);
      }
    };

    reader.readAsBinaryString(files[0]);
  };

  return (
    <Dropzone onDrop={onFileDrop}>
      {({ getRootProps, getInputProps, isDragAccept }) => (
        <Container {...getRootProps()} className={`flex flex-col items-center ${isDragAccept ? "hover" : ""}`}>
          <input {...getInputProps()} />
          <img src={documentImage} className="mt-12 mr-6" alt="" />
          <h5 className="mt-6">Drag and drop file here</h5>
          <p className="mt-6">or</p>
          <ButtonPrimary className="mt-6">Select File</ButtonPrimary>
        </Container>
      )}
    </Dropzone>
  );
};
