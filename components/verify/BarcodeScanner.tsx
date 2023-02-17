import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import { useWindowFocus } from "@utils/window-focus-hook";

interface BarcodeScannerProps {
  onResult: (url: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onResult }) => {
  const [barcodeInput, setBarcodeInput] = useState("");
  const isWindowFocused = useWindowFocus();

  /* 1. Handle keyboard input */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const validUrlCharacter = new RegExp(/^([A-z0-9]|[-_.~!*'();:@&=+$,/?%#]){1}$/);

      if (validUrlCharacter.test(e.key)) {
        setBarcodeInput((curr) => curr + e.key);
      } else if (e.key === "Enter") {
        onResult(barcodeInput);
        setBarcodeInput("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [barcodeInput]);

  /* 2. Clear barcode input 300ms after the last keydown */
  useEffect(() => {
    const clearBarcodeInputTimer = setTimeout(() => setBarcodeInput(""), 300);

    return () => {
      clearTimeout(clearBarcodeInputTimer);
    };
  }, [barcodeInput]);

  return (
    <div className="py-6">
      <p className="mb-0">Status:</p>
      {isWindowFocused ? <ReadyMessage /> : <NotReadyMessage />}
      {barcodeInput ? <Spinner /> : <ScanIcon />}
    </div>
  );
};

export default BarcodeScanner;

const ReadyMessage = () => <p className="text-xl font-extrabold">Ready, waiting for scan</p>;
const NotReadyMessage = () => <p className="text-xl font-extrabold">Not ready, current window not active</p>;

const Spinner = () => <FontAwesomeIcon icon={faCircleNotch} size={"3x"} className="animate-spin" />;
const ScanIcon = () => <img src="/images/scan-icon.svg" alt="Scan Icon" className="m-auto h-48" />;
