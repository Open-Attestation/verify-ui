import { NextSeo } from "next-seo";
import React, { useState, useEffect } from "react";

import { QrReader } from "react-qr-reader";

export interface QrScannerProps {
  currentMode: number;
}

const MEDIA_MODES = ["environment", "user", "scanner"];

export const QrScanner: React.FC<QrScannerProps> = ({ currentMode }) => {
  const [, setData] = useState("No result");

  const checkIfVerifyUrl = () => {};

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const updateWidth = () => setIsMobile(window.innerWidth < 768);

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="w-full px-8">
      <div className="relative">
        <NextSeo title="QR page" />
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.getText());
              window.open(result?.getText());
              //   checkIfVerifyUrl(result?.getText());
            }

            if (!!error) {
            }
          }}
          //this is facing mode : "environment " it will open backcamera of the smartphone and if not found will
          constraints={{ facingMode: MEDIA_MODES[currentMode], aspectRatio: 1 }}
          videoContainerStyle={{ paddingTop: isMobile ? "100%" : "50%" }}
          videoStyle={{ width: "unset", borderRadius: "0.5rem", margin: "auto", left: 0, right: 0 }}
        />
        <img
          alt="qr visual guide"
          src="/images/qr-crosshair.svg"
          className="h-5/6 absolute left-0 right-0 top-0 bottom-0 m-auto"
        />
      </div>
    </div>
  );
};

export default QrScanner;
