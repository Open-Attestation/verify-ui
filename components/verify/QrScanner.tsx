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
  const [devices, setDevices] = useState<string[]>(deviceIds);

  // const cameraComponent = (isFrontCamera: boolean) => (
  //   <>

  //   </>
  // );

  useEffect(() => {
    console.log("Device Ids change", deviceIds);
    setDevices(() => deviceIds);
  }, [deviceIds]);

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
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    console.log("isMobile equal ", isMobile);
  }, [isMobile]);

  const getFacingMode = () => {
    console.log("getFacingMode - currentMode", currentMode);
    // single camera, use front camera
    if (devices.length < 2 && currentMode != ScanMode.BACK_CAMERA) {
      return "user";
    }
    return "environment";
  };

  return (
    <div className="w-full px-8">
      <button
        onClick={() => {
          setIsLoading(!isLoading);
        }}
      >
        {" "}
        TOGGLE ISLOADING{" "}
      </button>
      <div className="relative">
        {/* {isLoading && cameraComponent(true)}
        {!isLoading && isActive && currentMode === ScanMode.FRONT_CAMERA && cameraComponent(true)}
        {!isLoading && isActive && currentMode === ScanMode.BACK_CAMERA && hasMultipleCameras && cameraComponent(false)} */}

        {isActive ? (
          <>
            <QrReader
              constraints={{ facingMode: getFacingMode() }}
              videoContainerStyle={{ paddingTop: isMobile ? "140%" : "60%", border: "1px solid" }}
              videoStyle={{ width: "unset", borderRadius: "0.5rem", margin: "auto", left: 0, right: 0 }}
              onResult={handleOnResult}
            />
            <span>{getFacingMode()}</span>
            <img
              alt="qr visual guide"
              src="/images/qr-crosshair.svg"
              className="h-5/6 absolute left-0 right-0 top-0 bottom-0 m-auto px-[20%]"
            />
          </>
        ) : (
          ""
        )}

        {/* Switch to scanner if no back camera */}
        {((currentMode === ScanMode.BACK_CAMERA && devices.length < 2) ||
          (currentMode === ScanMode.SCANNER && devices.length >= 2)) && <div> Add scanner component here </div>}
      </div>
    </div>
  );
};

export default QrScanner;
