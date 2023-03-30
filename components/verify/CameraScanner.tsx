import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { CameraDevice } from "html5-qrcode/camera/core";
import debounce from "lodash/debounce";

import Heading from "@components/text/Heading";
import { useWindowFocus } from "@utils/window-focus-hook";

const FIVE_MINUTES = 5 * 60 * 1000;

export type CustomMediaDeviceInfo = { device: CameraDevice; prettyLabel: string };

interface CameraScannerProps {
  cameraDevice?: CustomMediaDeviceInfo;
  onResult: (url: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ cameraDevice, onResult }) => {
  const isWindowFocused = useWindowFocus();
  const [isAwake, setIsAwake] = useState(true);
  const html5QrCodeRef = useRef<HTMLDivElement>(null);

  const onResultDebounced = debounce(onResult, 2000, { leading: true, trailing: false }); // Execute on leading edge (first call)
  const scheduleSleepDebounced = debounce(() => setIsAwake(false), FIVE_MINUTES, { leading: false, trailing: true }); // Execute on trailing edge (last call)

  /**
   * Enable (wake) camera and start scheduling sleep
   */
  const wakeCameraAndScheduleSleep = () => {
    setIsAwake(true);
    scheduleSleepDebounced();
  };

  /**
   * Cancel scheduled sleep
   */
  const cancelWakeCameraAndScheduleSleep = () => {
    scheduleSleepDebounced.cancel();
  };

  /* Initialise QR scanner when html5QrCodeRef is available, camera is awake and window is in focus */
  useEffect(() => {
    if (!html5QrCodeRef.current || !isAwake || !isWindowFocused) return;

    const html5QrCode = new Html5Qrcode(html5QrCodeRef.current.id, {
      formatsToSupport: [Html5QrcodeSupportedFormats["QR_CODE"]],
      verbose: false,
    });

    const isStarted = html5QrCode
      .start(
        cameraDevice?.device.id || { facingMode: "environment" },
        {
          fps: 10, // Scans for presence of QR code 10 times every second
          aspectRatio: 1,
        },
        (decodedText) => {
          onResultDebounced(decodedText); // Debounce is bypassed only after a 2-sec quiet period (i.e. no QR code detected for 2 seconds)
          wakeCameraAndScheduleSleep();
        },
        () => {} // Parse error on Html5Qrcode
      )
      .then(() => true)
      .catch((e) => {
        console.error("Unable to start Html5Qrcode:", e);
        return false;
      });

    return () => {
      cancelWakeCameraAndScheduleSleep();
      isStarted.then((started) => {
        if (started)
          html5QrCode.stop().catch((e) => {
            // Ignore this error as html5-qrcode library has a race condition issue causing error to always be thrown in React strict development mode
            // Issue: https://github.com/mebjas/html5-qrcode/issues/500#issuecomment-1214363818
            // Explanation: https://github.com/mebjas/html5-qrcode/pull/686#discussion_r1103632882
            // html5-qrcode library may be fixed in a future PR: https://github.com/mebjas/html5-qrcode/pull/686
            console.error("Unable to stop html5QrcodeScanner:", e);
          });
      });
    };
  }, [isAwake, isWindowFocused, cameraDevice]);

  /* When constraints are changed */
  useEffect(() => {
    wakeCameraAndScheduleSleep();

    return () => cancelWakeCameraAndScheduleSleep();
  }, [cameraDevice]);

  /* When window is back in focus */
  useEffect(() => {
    if (isWindowFocused) wakeCameraAndScheduleSleep();

    return () => cancelWakeCameraAndScheduleSleep();
  }, [isWindowFocused]);

  if (isAwake && isWindowFocused)
    return (
      <div className="relative">
        <div id="html5-qrcode" className="m-auto my-6 max-w-[60vh] rounded-lg overflow-hidden" ref={html5QrCodeRef} />
        <div className="absolute inset-0 flex justify-center">
          <img className="m-4" src="/images/qr-crosshair.svg" alt="qr visual guide" />
        </div>
      </div>
    );
  else if (!isAwake && isWindowFocused)
    return (
      <div className="relative m-auto my-6 p-4 max-w-[60vh] rounded-2xl bg-gray-200">
        <img className="w-full h-full" src="/images/qr-crosshair.svg" alt="qr visual guide" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Heading level="h2" className="text-2xl mb-4">
            Camera timed out
          </Heading>
          <button
            className={`btn hover:text-white inline-block
          text-white bg-primary hover:bg-primary-dark
          rounded-xl focus:ring
          transition-colors`}
            onClick={() => wakeCameraAndScheduleSleep()} // User wake
          >
            Relaunch camera
          </button>
        </div>
      </div>
    );
  else
    return (
      <div className="m-auto my-6 p-4 max-w-[60vh] rounded-2xl bg-gray-200">
        <img className="w-full h-full" src="/images/qr-crosshair.svg" alt="qr visual guide" />
      </div>
    );
};

export const getFilteredCameraDevices = async () => {
  /* Requests for camera permissions from user + enumerate all available cameras */
  const cameras = await Html5Qrcode.getCameras();

  /* Sort by device label */
  const sortedVideoDevices = cameras.sort((a, b) => {
    if (a.label < b.label) return -1;
    else if (a.label > b.label) return 1;
    else return 0;
  });

  const { userAgent } = navigator;

  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    /* iOS device: Filter for first instance of "Back Camera" & "Front Camera" */
    const iOsCameras: CustomMediaDeviceInfo[] = [];

    const backIOsCamera = sortedVideoDevices.find((device) => /Back Camera/i.test(device.label));
    if (backIOsCamera) iOsCameras.push({ device: backIOsCamera, prettyLabel: "Back Camera" });

    const frontIOsCamera = sortedVideoDevices.find((device) => /Front Camera/i.test(device.label));
    if (frontIOsCamera) iOsCameras.push({ device: frontIOsCamera, prettyLabel: "Front Camera" });

    return iOsCameras;
  } else if (/Android/i.test(userAgent)) {
    /* Android device: Filter for first instance of "back" & "front" */
    const androidCameras: CustomMediaDeviceInfo[] = [];

    const backAndroidCamera = sortedVideoDevices.find((device) => /back/i.test(device.label));
    if (backAndroidCamera) androidCameras.push({ device: backAndroidCamera, prettyLabel: "Back Camera" });

    const frontAndroidCamera = sortedVideoDevices.find((device) => /front/i.test(device.label));
    if (frontAndroidCamera) androidCameras.push({ device: frontAndroidCamera, prettyLabel: "Front Camera" });

    return androidCameras;
  } else {
    /* All other user agents: Just return all sorted cameras */
    return sortedVideoDevices.map<CustomMediaDeviceInfo>((device) => ({
      device: device,
      prettyLabel: device.label.replace(/\s[(].{4}:.{4}[)]/, ""),
    }));
  }
};
