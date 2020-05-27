import { WrappedDocument } from "@govtechsg/open-attestation";
import React from "react";
import Dropzone from "react-dropzone";

interface DropZoneProps {
  setRawDocument: (doc: WrappedDocument) => void;
}
export const DropZone: React.FunctionComponent<DropZoneProps> = ({ setRawDocument }: DropZoneProps) => {
  const onFileDrop = (files: File[]): void => {
    const reader = new FileReader();

    reader.onerror = () => {
      alert(`The file uploaded is not a valid Open Attesation file, error: ${reader.error}`);
    };

    reader.onload = () => {
      try {
        if (reader.result && typeof reader.result === "string") {
          const json = JSON.parse(reader.result);
          setRawDocument(json);
        } else {
          alert(`The file uploaded is not a valid Open Attesation file`);
        }
      } catch (e) {
        alert(`The file uploaded is not a valid Open Attesation file, error: ${e.message}`);
      }
    };

    reader.readAsBinaryString(files[0]);
  };

  return (
    <Dropzone onDrop={onFileDrop}>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className="h-screen w-screen text-center border-dashed border-gray-500 border-4 bg-gray-200 flex flex-col justify-center"
        >
          <input {...getInputProps()} />
          <p className="text-gray-700">Drag and drop your tradetrust file</p>
        </div>
      )}
    </Dropzone>
  );
};
