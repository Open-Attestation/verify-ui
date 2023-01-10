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
  const [isLoading, setIsLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1.7);
  const [yesHeight, setYesHeight] = useState(0);
  const [yesWidth, setYesWidth] = useState(0);
  const updateWidth = () => setIsMobile(window.innerWidth < 768);
  const updateVisibility = () => setIsActive(!document.hidden);
  const hasMultipleCameras = deviceIds.length >= 2;

  const cameraComponent = (isFrontCamera: boolean) => (
    <>
      <QrReader
        key={isFrontCamera ? "user" : "environment"}
        constraints={{ facingMode: isFrontCamera ? "user" : "environment"}}
        videoContainerStyle={{ paddingTop: isMobile ? "140%" : "60%", border: "1px solid" }}
        videoStyle={{ width: "unset", borderRadius: "0.5rem", margin: "auto", left: 0, right: 0 }}
        // videoContainerStyle={{ paddingTop: "100%" }}
        // videoStyle={{ height: "100%", width: "unset" }}
        onResult={handleOnResult}
      />
      <img
        alt="qr visual guide"
        src="/images/qr-crosshair.svg"
        className="h-5/6 absolute left-0 right-0 top-0 bottom-0 m-auto px-[20%]"
      />
    </>
  );

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
    console.log("mounting QrScanner");
    window.addEventListener("resize", updateWidth);
    window.addEventListener("visibilitychange", updateVisibility);
    return () => {
      console.log("unmounting QrScanner");
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div className="w-full px-8">
      <button
        onClick={() => {
          const vid = document.getElementById("video") as HTMLVideoElement;
          setYesHeight(vid.videoHeight);
          setYesWidth(vid.videoWidth);
          console.log("Height is ", vid.videoHeight);
          console.log("Width is ", vid.videoWidth);
        }}
      >
        Check aspect ratio
      </button>
      <button className="bg-green-300 px-4" onClick={() => setIsLoading(!isLoading)}>TOGGLE isLoading</button>
      {yesHeight && <p>Video height is {yesHeight}</p>}
      {yesWidth && <p>Video width is {yesWidth}</p>}
      Aspect ratio{" "}
      <input
        type="number"
        step="0.1"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          console.log("Aspect ratio is ", e.target.value);
          setAspectRatio(parseFloat(e.target.value));
        }}
      />
      <div className="relative">
        {isLoading && cameraComponent(true)}
        {/* {!isLoading && isActive && currentMode === ScanMode.FRONT_CAMERA && cameraComponent(true)}
        {!isLoading && isActive && currentMode === ScanMode.BACK_CAMERA && hasMultipleCameras && cameraComponent(false)} */}
        {!isLoading && aspectRatio && isActive && cameraComponent(!hasMultipleCameras || currentMode == ScanMode.FRONT_CAMERA)}
        {/* Switch to scanner if no back camera */}
        {((currentMode === ScanMode.BACK_CAMERA && !hasMultipleCameras) ||
          (currentMode === ScanMode.SCANNER && hasMultipleCameras)) && <div> Add scanner component here </div>}
      </div>
    </div>
  );
};

export default QrScanner;
