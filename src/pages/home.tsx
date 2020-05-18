import React from "react";
import { DropZone } from "../components/DropZone";

export const HomePage: React.FunctionComponent = () => {
  return (
    <div className="bg-gray-100">
      <h1 className="mb-20 text-xl">Home page</h1>
      <DropZone />
    </div>
  );
};
