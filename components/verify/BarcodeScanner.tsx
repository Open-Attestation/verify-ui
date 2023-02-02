import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import { useWindowFocus } from "@utils/window-focus-hook";

const Verifier: React.FC = () => {
  const [barcodeInput, setBarcodeInput] = useState("");
  const isWindowFocused = useWindowFocus();

  /* 1. Handle keyboard input */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const validUrlCharacter = new RegExp(/^([A-z0-9]|[-_.~!*'();:@&=+$,/?%#]){1}$/);

      if (validUrlCharacter.test(e.key)) {
        setBarcodeInput((curr) => curr + e.key);
      } else if (e.key === "Enter") {
        handleSubmit(barcodeInput);
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
    <div className="pt-6">
      <p className="mb-0">Status:</p>
      {isWindowFocused ? <ReadyMessage /> : <NotReadyMessage />}
      {barcodeInput ? <Spinner /> : <ScanIcon />}
    </div>
  );
};

export default Verifier;

const handleSubmit = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.host !== "www.verify.gov.sg") throw new Error(`Invalid Verify QR, please try again: ${url}`);
    window.open(parsedUrl, "_blank", "resizable,width=720,height=960");
  } catch (e) {
    console.error(e);
    alert("Invalid Verify QR, please try again");
  }
};

const ReadyMessage = () => <p className="text-xl font-extrabold">Ready, waiting for scan</p>;
const NotReadyMessage = () => <p className="text-xl text-red-500 font-extrabold">Please click here to begin</p>;

const Spinner = () => <FontAwesomeIcon icon={faCircleNotch} size={"3x"} className="animate-spin" />;
const ScanIcon = () => <img src="/images/scan-icon.svg" alt="Scan Icon" className="m-auto h-48" />;
