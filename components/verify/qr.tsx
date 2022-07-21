import { NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useState, useRef } from "react";

import { QrReader } from "react-qr-reader";
import Router from "next/router";

// const viewFinder: React.FC = () => <div className="bg-stone-900">asd</div>;

export const QR: React.FC = () => {
  const [data, setData] = useState("No result");
  return (
    <div className="w-96 h-96 overflow-hidden rounded-3xl border-4 border-blue-400	">
      <NextSeo title="QR page" />
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.getText());
            Router.push(result?.getText());
          }

          if (!!error) {
            console.info(error);
          }
        }}
        //this is facing mode : "environment " it will open backcamera of the smartphone and if not found will
        // open the front camera
        constraints={{ facingMode: "environment", aspectRatio: 1 }}
        // ViewFinder={viewFinder}
        // containerStyle={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default QR;
