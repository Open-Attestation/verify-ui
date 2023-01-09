import React, { useState, useEffect } from "react";

import { QrReader } from "react-qr-reader";

export interface QrScannerProps {
  currentMode: number;
  deviceIds: string[];
  refreshCallback: any;
}

enum ScanMode {
  FRONT_CAMERA,
  BACK_CAMERA,
  SCANNER,
}

export const QrScanner: React.FC<QrScannerProps> = ({ currentMode, deviceIds, refreshCallback }) => {
  const isWindowUndefined = typeof window === "undefined";
  const [isMobile, setIsMobile] = useState(!isWindowUndefined && window.innerWidth < 768);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const updateWidth = () => setIsMobile(window.innerWidth < 768);
  const updateVisibility = () => setIsActive(!document.hidden);
  const [hasMultipleCameras] = useState(deviceIds.length >= 2);

  const cameraComponent = (isFrontCamera: boolean) => (
    <>
      <QrReader
        constraints={{ facingMode: isFrontCamera ? "user" : "environment" }}
        videoContainerStyle={{ paddingTop: isMobile ? "140%" : "60%", border: "1px solid" }}
        // videoStyle={{ width: "unset", borderRadius: "0.5rem", margin: "auto", left: 0, right: 0 }}
        onResult={handleOnResult}
      />
      <p>isFrontCamera: {isFrontCamera}</p>
      <img
        alt="qr visual guide"
        src="/images/qr-crosshair.svg"
        className="h-5/6 absolute left-0 right-0 top-0 bottom-0 m-auto px-[20%]"
      />
    </>
  );

  useEffect(() => {
    console.log("hasMultipleCameras", hasMultipleCameras);
  });
  const handleOnResult = (res: any) => {
    if (res === undefined) {
      return;
    }
    refreshCallback(Date.now()); // Trigger useEffect in qr page
    const url = res.text;
    if (url.startsWith("https://www.verify.gov.sg/verify?q=")) {
      window.open(url);
    } else {
      alert("Invalid Verify QR, please try again");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    window.addEventListener("visibilitychange", updateVisibility);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    console.log(window);
    console.log("Type of window ", typeof window);
    updateWidth();
  }, [window]);

  useEffect(() => {
    console.log("isMobile equal ", isMobile);
  }, [isMobile]);

  return (
    <div className="w-full px-8">
      <div className="relative">
        {isActive && currentMode === ScanMode.FRONT_CAMERA && cameraComponent(true)}
        {isActive && currentMode === ScanMode.BACK_CAMERA && hasMultipleCameras && cameraComponent(false)}
        {/* Switch to scanner if no back camera */}
        {((currentMode === ScanMode.BACK_CAMERA && !hasMultipleCameras) ||
          (currentMode === ScanMode.SCANNER && hasMultipleCameras)) && <div> Add scanner component here </div>}
      </div>
    </div>
  );
};

export default QrScanner;
