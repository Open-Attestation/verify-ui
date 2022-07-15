import { NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useState, useRef } from "react";

import { QrReader } from "react-qr-reader";

const QR: NextPage = () => {
  const [data, setData] = useState("No result");
  return (
    <div>
      <NextSeo title="QR page" />
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.getText());
          }

          if (!!error) {
            console.info(error);
          }
        }}
        //this is facing mode : "environment " it will open backcamera of the smartphone and if not found will
        // open the front camera
        constraints={{ facingMode: "environment" }}
        containerStyle={{ width: "40%", height: "40%" }}
      />
      <p>{data}</p>
    </div>
  );
};

export default QR;
