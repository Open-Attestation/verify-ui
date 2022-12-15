import { NextSeo } from "next-seo";
import React, { useState, useEffect } from "react";

import { QrReader } from "react-qr-reader";

export interface QrScannerProps {
  currentMode: number;
}

const MEDIA_MODES = [
  "f8f0b9416450ce38cff04c1042155721e4144d769b284c0c3f2d8dd1b8aa71b6",
  "ad07d1769cc8a810a60ed4813f518e8ffd6b054399b5e1bca050482a7d47cf27",
  "scanner",
];

export const QrScanner: React.FC<QrScannerProps> = ({ currentMode }) => {
  const [, setData] = useState("No result");

  const checkIfVerifyUrl = () => {};

  const isWindowUndefined = typeof window === "undefined";
  const [isMobile, setIsMobile] = useState(!isWindowUndefined && window.innerWidth < 768);
  const updateWidth = () => setIsMobile(window.innerWidth < 768);

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="w-full px-8">
      <div className="relative">
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
          constraints={{ deviceId: MEDIA_MODES[currentMode], aspectRatio: 1 }}
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
