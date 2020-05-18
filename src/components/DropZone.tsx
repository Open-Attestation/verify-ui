import React from "react";
import Dropzone from "react-dropzone";

const onFileDrop = (files: File[]): void => {
  const reader = new FileReader();
  try {
    reader.onerror = () => {
      reader.abort();
      throw new Error("Unable to read given file");
    };

    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        JSON.parse(reader.result);
        alert(`The file ${files[0].name} will be processed`);
      } else {
        throw new Error("Unable to read given file");
      }
    };

    reader.readAsBinaryString(files[0]);
  } catch (e) {
    alert(`The file uploaded is not a valid TradeTrust file, error: ${e.message}`);
  }
};

export const DropZone: React.FunctionComponent = () => {
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
