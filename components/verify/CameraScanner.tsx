import { QrReader } from "react-qr-reader";

interface CameraScannerProps {
  constraints: MediaTrackConstraints;
  onResult: (url: string) => void; // TODO: Implement debouncing
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ constraints, onResult }) => {
  return (
    <div className="relative">
      <QrReader
        key={JSON.stringify(constraints)}
        constraints={constraints}
        className="m-auto my-6 max-w-lg"
        videoStyle={{ borderRadius: "0.5rem", objectFit: "cover" }}
        onResult={(res) => {
          if (res) onResult(res.getText());
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
