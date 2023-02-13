import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import debounce from "lodash/debounce";

import Heading from "@components/text/Heading";

const FIVE_MINUTES = 5 * 60 * 1000;

interface CameraScannerProps {
  constraints: MediaTrackConstraints;
  onResult: (url: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ constraints, onResult }) => {
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

  if (isAwake)
    return (
      <div className="relative">
        <QrReader
          key={JSON.stringify(constraints)}
          constraints={constraints}
          className="m-auto my-6 max-w-lg"
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
  else
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
};

export const getCameraDevices = async () => {
  /* Request camera permissions from user */
  await navigator.mediaDevices.getUserMedia({ video: true });

  /* Enumerate all available cameras */
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = mediaDevices.filter((device) => device.kind === "videoinput");

  return videoDevices;
};
