import { NextSeo } from "next-seo";
import React, { useState, useEffect } from "react";

import { QrReader } from "react-qr-reader";

export interface QrScannerProps {
  currentMode: number;
  mediaModes: string[];
}

const MEDIA_MODES = ["environment", "user", "scanner"];

export const QrScanner: React.FC<QrScannerProps> = ({ currentMode, mediaModes }) => {
  const [, setData] = useState("No result");

  const checkIfVerifyUrl = () => {};
  const hardcoded = [
    "79502a85310f82077a11f49786f5520a8e9c4b3d7fea4ac136be26e062f7d77c",
    "f39b4ed2489ab9f4087268806e6536b4ca5bf4a0b319712f0bb057be679bdbed",
    "scanner",
  ];

  const isWindowUndefined = typeof window === "undefined";
  const [isMobile, setIsMobile] = useState(!isWindowUndefined && window.innerWidth < 768);
  const updateWidth = () => setIsMobile(window.innerWidth < 768);

  useEffect(() => {
    console.log(mediaModes);
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
          constraints={{
            deviceId: { exact: "f39b4ed2489ab9f4087268806e6536b4ca5bf4a0b319712f0bb057be679bdbed" },
            aspectRatio: 1,
          }}
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
