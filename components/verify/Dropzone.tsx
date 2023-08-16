import React, { useCallback } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { validateSchema, v2, v3 } from "@govtechsg/open-attestation";

import Heading from "@components/text/Heading";
import { CodedError } from "@utils/coded-error";
import { StatusProps } from "@components/figure/StatusMessage";
import Link from "next/link";

interface DropzoneProps extends React.HTMLAttributes<HTMLElement> {
  onDocumentDropped?: (wrappedDocument: v2.WrappedDocument | v3.WrappedDocument) => void;
  onDocumentError?: (e: StatusProps) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onDocumentDropped = () => {}, onDocumentError = () => {} }) => {
  const onDrop: DropzoneOptions["onDrop"] = useCallback(
    async (files: File[]) => {
      onDocumentError({ type: "NIL" });

      const reader = new FileReader();

      reader.onerror = () => {
        console.error(reader.error);
      };

      reader.onload = () => {
        try {
          const { result } = reader;

          if (typeof result !== "string") {
            throw new CodedError(
              "InvalidDocumentError",
              `Unable to read file of type: ${typeof result}. The uploaded file is not a valid OpenAttestation document`
            );
          }

          const parsed = JSON.parse(result);

          if (!validateSchema(parsed)) {
            throw new CodedError("InvalidDocumentError", "The uploaded file is not a valid OpenAttestation document");
          }

          onDocumentDropped(parsed as any);
        } catch (e) {
          if (e instanceof CodedError) {
            onDocumentError({
              type: "ERROR",
              message: (
                <div className="text-center">
                  {e.type}: {[e.message, e.details].filter(Boolean).join(" - ")}
                </div>
              ),
            });
          } else if (e instanceof SyntaxError) {
            onDocumentError({
              type: "ERROR",
              message: (
                <div className="text-center">{e.name}: The uploaded file is not a valid OpenAttestation document</div>
              ),
            });
          } else {
            onDocumentError({
              type: "ERROR",
              message: (
                <div className="text-center">{e instanceof Error ? `${e.name}: ${e.message}` : JSON.stringify(e)}</div>
              ),
            });
          }
          console.error(e);
        }
      };

      reader.readAsText(files[0]);
    },
    [onDocumentDropped, onDocumentError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <section className="container text-center my-10">
      <Heading level="h1">Verify Documents</Heading>
      <p>Drop a government issued certificate</p>
      <div
        className={[
          "p-6 my-10 border-4 border-dotted border-gray-200 rounded-lg bg-white ",
          isDragActive && "ring-4 ring-primary shadow-xl",
        ]
          .filter(Boolean)
          .join(" ")}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-5">
          <img className="max-w-[200px] mt-10" src="/images/upload-document.svg" alt="Upload document" />
          <Heading level="h2" className="text-xl">
            Drag and drop file here
          </Heading>
          <p>or</p>
          <button
            className={`font-bold py-2 px-4 text-white bg-primary hover:bg-primary-dark rounded-xl focus:ring transition-colors`}
          >
            Select File
          </button>
          <p className="pt-10">
            Alternatively, if you have a Verify QR, you could verify the document by{"  "}
            <Link href="/qr" passHref>
              <a
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="text-blue-600 underline hover:text-blue-700"
              >
                scanning it
              </a>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Dropzone;
