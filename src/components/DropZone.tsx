import React from "react";
import Dropzone from "react-dropzone";

export const DropZone: React.FunctionComponent = () => {
  return (
    <Dropzone onDrop={(acceptedFile) => alert(`The file ${acceptedFile[0].name} will be processed`)}>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className="h-84 w-84 p-16 text-center border-dashed border-gray-500 border-2 bg-gray-200 flex flex-col justify-center"
        >
          <input {...getInputProps()} />
          <p className="text-gray-700">Drag and drop your tradetrust file</p>
        </div>
      )}
    </Dropzone>
  );
};
