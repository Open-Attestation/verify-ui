import { useState, useEffect } from "react";
import type { NextPage } from "next";

import Layout from "@components/layout/Layout";
import Heading from "@components/text/Heading";
import QrScanner from "@components/verify/QrScanner";
import Link from "next/link";
import { NextSeo } from "next-seo";

const SCAN_MODES = ["Camera 1", "Camera 2", "Camera", "barcode scanner"];

const Qr: NextPage = () => {
  const [currentMode, setCurrentMode] = useState<number>(0);
  const [devicesFound, setDevicesFound] = useState<string[]>(["", ""]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isCameraMissing, setIsCameraMissing] = useState<boolean>(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((devices) => {
        let videoDevices = devices.filter((device) => device.kind === "videoinput");
        const tempList = devicesFound;
        let hasFrontCamera = false;
        let hasBackCamera = false;
        console.log(videoDevices);
        // videoDevices = [];
        if (videoDevices.length === 0) {
          setIsCameraMissing(true);
          return;
        }
        videoDevices.forEach((device) => {
          if (device.label.toLocaleLowerCase().includes("front")) {
            tempList[0] = device.deviceId;
            hasFrontCamera = true;
          }
          if (device.label.toLocaleLowerCase().includes("back")) {
            tempList[1] = device.deviceId;
            hasBackCamera = true;
          }
        });
        if (hasFrontCamera && hasBackCamera) {
          SCAN_MODES.splice(2, 1);
        } else {
          SCAN_MODES.splice(0, 2);
        }
        setDevicesFound(tempList.filter((deviceId) => deviceId !== ""));
        setIsLoaded(true);
      })
      .catch((e) => {
        if (e.message.includes("Permission denied")) {
          setIsError(true);
        } else {
          setIsCameraMissing(true);
        }
      });
  }, []);

  const remainingModes = () => {
    return (
      <div className="flex flex-row gap-2 pb-4">
        {SCAN_MODES.map((mode, i) => {
          if (currentMode === i) return;
          return (
            <div
              onClick={() => {
                console.log("PRESSED", i)
                setCurrentMode(i);
              }}
              className="text-blue-600 underline hover:text-blue-700"
              key={mode}
            >
              Switch to {mode}
            </div>
          );
        })}
      </div>
    );
  };

  const errorComponent = (isError: boolean, isCameraMissing: boolean) => {
    return (
      <div className="flex flex-col items-center bg-gray-200 mx-8 py-32">
        <Heading level="h2" className="text-2xl">
          {isCameraMissing ? "Camera not found" : "Error accessing camera"}
        </Heading>
        {isCameraMissing ? (
          <>
            <div>Please ensure it is connected, installed properly, and not in use by other applications.</div>
            <div>Refresh the page after connecting your camera.</div>
          </>
        ) : (
          <p>Please refresh the page and grant access to your camera from your browser settings.</p>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <NextSeo title="QR page" />
      <section className="container text-center my-10 pb-2 mx-auto">
        <Heading level="h1">Scan Verify QR</Heading>
        <p>Show the Verify QR in front of the camera or scanner</p>

        <div className="md:mx-40 my-10 py-10 border-4 border-dashed rounded-lg bg-white ring-primary shadow-xl">
          {isLoaded && (
            <div className="flex flex-col items-center">
              <div className="flex flex-row gap-2">
                <div>Current scan mode: </div>
                <div className="font-bold">{SCAN_MODES[currentMode]}</div>
              </div>
              {remainingModes()}
              <QrScanner currentMode={currentMode} deviceIds={devicesFound}></QrScanner>
            </div>
          )}
          {(isError || isCameraMissing) && errorComponent(isError, isCameraMissing)}
          <div className="flex flex-col pt-10">
            <div>If you have problems scanning the QR, you may want to verify by</div>
            <Link href="/verify">
              <a target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-700">
                uploading your OA certificate
              </a>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Qr;
