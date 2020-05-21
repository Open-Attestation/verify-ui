import React from "react";
import Dropzone from "react-dropzone";
import { useHistory } from "react-router-dom";

export const DropZone: React.FunctionComponent = () => {
  const history = useHistory();

  const onFileDrop = (files: File[]): void => {
    const reader = new FileReader();

    reader.onerror = () => {
      alert(`The file uploaded is not a valid Open Attesation file, error: ${reader.error}`);
    };

    reader.onload = () => {
      try {
        if (reader.result && typeof reader.result === "string") {
          const json = JSON.parse(reader.result);
          alert(`The file ${files[0].name} will be processed`);
          history.push("/viewer", { json: json });
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
          className="h-64 w-64 p-16 text-center border-dashed border-gray-500 border-2 bg-gray-200 flex flex-col justify-center"
        >
          <input {...getInputProps()} />
          <p className="text-gray-700">Drag and drop your tradetrust file</p>
        </div>
      )}
    </Dropzone>
  );
};
