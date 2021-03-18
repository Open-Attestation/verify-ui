import styled from "@emotion/styled";
import { WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { XCircle } from "react-feather";
import documentImage from "./images/document.svg";

const Container = styled.div`
  border: 2px dashed var(--grey-light);
  box-sizing: border-box;
  border-radius: 20px;
  width: 100%;
  min-height: 520px;
  &.hover {
    background: #f0f0f0;
    border-color: var(--primary);
    box-shadow: 0 0 10px 1px var(--teal);
  }
`;

interface DropZoneProps {
  onDocumentDropped: (document: WrappedDocument) => void;
}
export const DropZone: React.FunctionComponent<DropZoneProps> = ({ onDocumentDropped }: DropZoneProps) => {
  const [fileErrorMsg, setFileErrorMsg] = useState("");

  const onFileDrop = (files: File[]): void => {
    const reader = new FileReader();

    setFileErrorMsg("");

    reader.onerror = () => {
      setFileErrorMsg(`The file uploaded is not a valid Open Attestation file.`);
      console.error(reader.error);
    };

    reader.onload = () => {
      try {
        if (reader.result && typeof reader.result === "string") {
          onDocumentDropped(JSON.parse(reader.result));
        } else {
          setFileErrorMsg(`The file uploaded is not a valid Open Attestation file.`);
        }
      } catch (e) {
        setFileErrorMsg(`The file uploaded is not a valid Open Attestation file.`);
        console.error(e);
      }
    };

    reader.readAsText(files[0]);
  };

  return (
    <Dropzone onDrop={onFileDrop}>
      {({ getRootProps, getInputProps, isDragAccept }) => (
        <Container
          {...getRootProps()}
          className={`flex flex-col items-center bg-white p-4 ${isDragAccept ? "hover" : ""}`}
        >
          {fileErrorMsg && (
            <div className="flex flex-wrap" data-testid="file-error">
              <div className="w-full">
                <div className="flex flex-wrap text-red-500">
                  <div className="w-auto mr-2">
                    <XCircle />
                  </div>
                  <div className="w-auto">
                    <h4>File cannot be read</h4>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <p>{fileErrorMsg}</p>
              </div>
            </div>
          )}
          <input {...getInputProps()} />
          <img src={documentImage} className="mt-12 mr-6" alt="" />
          <h5 className="mt-6">Drag and drop file here</h5>
          <p className="mt-6">or</p>
          <button className="btn-solid-primary mt-6">Select File</button>
        </Container>
      )}
    </Dropzone>
  );
};
