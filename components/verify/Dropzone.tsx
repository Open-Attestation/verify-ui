import React, { useState, useCallback } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { validateSchema, v2, v3 } from "@govtechsg/open-attestation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

import Heading from "@components/text/Heading";
import { CodedError } from "@utils/coded-error";

const ErrorMessage = (
  <div className="bg-red-100 px-6 py-4 rounded-lg text-lg">
    <Heading level="h2" className="text-xl font-bold">
      <FontAwesomeIcon className="mr-2" icon={faCircleXmark} />
      File cannot be read
    </Heading>
    The uploaded file is not a valid OpenAttestation document.
  </div>
);

interface DropzoneProps extends React.HTMLAttributes<HTMLElement> {
  onDocumentDropped?: (wrappedDocument: v2.WrappedDocument | v3.WrappedDocument) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onDocumentDropped }) => {
  const [errorState, setErrorState] = useState(false);

  const onDrop: DropzoneOptions["onDrop"] = useCallback(
    async (files: File[]) => {
      setErrorState(false);

      const reader = new FileReader();

      reader.onerror = () => {
        setErrorState(true);
        console.error(reader.error);
      };

      reader.onload = () => {
        try {
          const { result } = reader;

          if (typeof result !== "string") {
            throw new CodedError(
              "InvalidDocumentError",
              "Unable to read file content. Please upload a .OA or .JSON file."
            );
          }

          const parsed = JSON.parse(result);

          if (!validateSchema(parsed)) {
            throw new CodedError(
              "InvalidDocumentError",
              "File is not a valid OpenAttestation document. Please upload a .OA or .JSON file."
            );
          }

          if (typeof onDocumentDropped === "function") onDocumentDropped(parsed as any);
        } catch (e) {
          setErrorState(true);
          console.error(e);
        }
      };

      reader.readAsText(files[0]);
    },
    [onDocumentDropped]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <section className="container text-center my-10">
      <Heading level="h1">Verify Documents</Heading>
      <p>Drop a government issued certificate</p>

      <div
        className={[
          "my-10 py-20 border-4 border-dotted rounded-lg bg-white",
          isDragActive && "ring-4 ring-primary shadow-xl",
        ]
          .filter(Boolean)
          .join(" ")}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-5">
          {errorState && ErrorMessage}
          <img className="max-w-[200px]" src="images/upload-document.svg" alt="Upload document" />
          <Heading level="h2" className="text-xl">
            Drag and drop file here
          </Heading>
          <p>or</p>
          <button
            className={`font-bold py-2 px-4 text-white bg-primary hover:bg-primary-dark rounded-xl focus:ring transition-colors`}
          >
            Select File
          </button>
        </div>
      </div>
    </section>
  );
};

export default Dropzone;
