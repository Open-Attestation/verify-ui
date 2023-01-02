import { NextSeo } from "next-seo";
import React, { useState, useEffect } from "react";

import { QrReader } from "react-qr-reader";

export interface QrScannerProps {
  currentMode: number;
  deviceIds: string[];
}

enum ScanMode {
  FRONT_CAMERA,
  BACK_CAMERA,
  SCANNER,
}

export const QrScanner: React.FC<QrScannerProps> = ({ currentMode, deviceIds }) => {
  const isWindowUndefined = typeof window === "undefined";
  const [isMobile, setIsMobile] = useState(!isWindowUndefined && window.innerWidth < 768);
  const updateWidth = () => setIsMobile(window.innerWidth < 768);
  const hasMultipleCameras = deviceIds.length >= 2;

  const cameraComponent = (isFrontCamera: boolean) => (
    <>
      <QrReader
        constraints={{ facingMode: isFrontCamera ? "user" : "environment" }}
        videoContainerStyle={{ paddingTop: isMobile ? "100%" : "50%" }}
        videoStyle={{ width: "unset", borderRadius: "0.5rem", margin: "auto", left: 0, right: 0 }}
        onResult={(res) => {
          handleOnResult(res);
        }}
      />
      <img
        alt="qr visual guide"
        src="/images/qr-crosshair.svg"
        className="h-5/6 absolute left-0 right-0 top-0 bottom-0 m-auto"
      />
    </>
  );

  const handleOnResult = (res: any) => {
    if (res === undefined) {
      return;
    }
    const url = res.text;
    if (url.startsWith("https://www.verify.gov.sg/verify?q=")) {
      window.open(url);
    } else {
      alert("Invalid Verify QR, please try again");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="w-full px-8">
      <div className="relative">
        {currentMode === ScanMode.FRONT_CAMERA && cameraComponent(true)}
        {currentMode === ScanMode.BACK_CAMERA && hasMultipleCameras && cameraComponent(false)}
        {/* Switch to scanner if no back camera */}
        {((currentMode === ScanMode.BACK_CAMERA && !hasMultipleCameras) ||
          (currentMode === ScanMode.SCANNER && hasMultipleCameras)) && <div> Add scanner component here </div>}
      </div>
    </div>
  );
};

export default QrScanner;
