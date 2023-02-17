import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import debounce from "lodash/debounce";

import Heading from "@components/text/Heading";
import { useWindowFocus } from "@utils/window-focus-hook";

const FIVE_MINUTES = 5 * 60 * 1000;

interface CameraScannerProps {
  constraints: MediaTrackConstraints;
  onResult: (url: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ constraints, onResult }) => {
  const isWindowFocused = useWindowFocus();
  const [isAwake, setIsAwake] = useState(true);

  const onResultDebounced = debounce(onResult, 2000, { leading: true, trailing: false }); // Execute on leading edge (first call)
  const scheduleSleepDebounced = debounce(() => setIsAwake(false), FIVE_MINUTES, { leading: false, trailing: true }); // Execute on trailing edge (last call)

  /**
   * Enable (wake) camera and start scheduling sleep
   */
  const wakeCameraAndScheduleSleep = () => {
    setIsAwake(true);
    scheduleSleepDebounced();
  };

  /* When constraints are changed */
  useEffect(() => {
    wakeCameraAndScheduleSleep();

    return () => scheduleSleepDebounced.cancel();
  }, [constraints]);

  /* When window is back in focus */
  useEffect(() => {
    if (isWindowFocused) wakeCameraAndScheduleSleep();

    return () => scheduleSleepDebounced.cancel();
  }, [isWindowFocused]);

  if (isAwake && isWindowFocused)
    return (
      <div className="relative">
        <QrReader
          key={JSON.stringify(constraints)}
          constraints={constraints}
          className="m-auto my-6 max-w-[60vh]" // QrReader is square, sized via width; Limit max width according to device height
          videoStyle={{ borderRadius: "0.5rem", objectFit: "cover" }}
          onResult={(res) => {
            if (res) {
              onResultDebounced(res.getText());
              wakeCameraAndScheduleSleep(); // When scanning
            }
          }}
        />
        <div className="absolute inset-0 flex justify-center">
          <img className="m-4" src="/images/qr-crosshair.svg" alt="qr visual guide" />
        </div>
      </div>
    );
  else if (!isAwake && isWindowFocused)
    return (
      <div className="flex flex-col items-center my-32">
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
    );
  else
    return (
      <div className="m-auto my-6 p-4 max-w-[60vh] rounded-2xl bg-gray-200">
        <img className="w-full h-full" src="/images/qr-crosshair.svg" alt="qr visual guide" />
      </div>
    );
};

export type CustomMediaDeviceInfo = { device: MediaDeviceInfo; prettyLabel: string };

export const getFilteredCameraDevices = async () => {
  /* Request camera permissions from user */
  await navigator.mediaDevices.getUserMedia({ video: true });

  /* Enumerate all available cameras */
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = mediaDevices.filter((device) => device.kind === "videoinput");

  /* Sort by device label */
  const sortedVideoDevices = videoDevices.sort((a, b) => {
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
