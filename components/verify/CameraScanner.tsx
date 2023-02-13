import { QrReader } from "react-qr-reader";
import debounce from "lodash/debounce";

interface CameraScannerProps {
  constraints: MediaTrackConstraints;
  onResult: (url: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ constraints, onResult }) => {
  const onResultDebounced = debounce(onResult, 2000, { leading: true, trailing: false }); // Execute on trailing edge (first call)

  return (
    <div className="relative">
      <QrReader
        key={JSON.stringify(constraints)}
        constraints={constraints}
        className="m-auto my-6 max-w-lg"
        videoStyle={{ borderRadius: "0.5rem", objectFit: "cover" }}
        onResult={(res) => {
          if (res) onResultDebounced(res.getText());
        }}
      />
      <div className="absolute inset-0 flex justify-center">
        <img className="m-4" src="/images/qr-crosshair.svg" alt="qr visual guide" />
      </div>
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

