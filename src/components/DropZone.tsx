import React from "react";
import Dropzone from "react-dropzone";
import styles from "./dropzone.module.css";

export const DropZone: React.FunctionComponent = () => {
  return (
    <Dropzone onDrop={(acceptedFile) => alert(`The file ${acceptedFile[0].name} will be processed`)}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps({ className: styles.dropzoneStyle })}>
          <input {...getInputProps()} />
          <p>Drag and drop your tradetrust file</p>
        </div>
      )}
    </Dropzone>
  );
};
