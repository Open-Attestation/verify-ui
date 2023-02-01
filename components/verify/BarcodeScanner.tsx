import { useEffect, useRef, useState, KeyboardEventHandler } from "react";

const Verifier: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  /* Focus input field if it ever looses focus */
  useEffect(() => {
    if (!isFocused) {
      inputRef.current?.focus();
      setBarcodeInput("");
    }
  }, [isFocused, inputRef]);

  const onSubmit = () => {
    // TODO: [Validation] Check if valid URL and domain = verify.gov.sg then redirect
    window.open(barcodeInput, "_blank", "resizable,width=720,height=960");
    setBarcodeInput("");
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") return onSubmit();
    /* Clear input field if there are no edits for 1 second */
  };

  return (
    <div className="pt-6">
      <p className="mb-0">Status:</p>
      {isFocused ? <StatusReady /> : <StatusNotReady />}

      <input
        className="h-0 w-full bg-blue-100 opacity-50"
        value={barcodeInput}
        onChange={(e) => setBarcodeInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={inputRef}
        autoFocus
      />
    </div>
  );
};

export default Verifier;

function StatusReady() {
  return (
    <>
      <p className="text-xl font-extrabold">Ready, waiting for scan</p>
      <img src="/images/scan-icon.svg" alt="Scan Icon" className="m-auto h-48" />
    </>
  );
}

function StatusNotReady() {
  return (
    <>
      <p className="text-xl text-red-500 font-extrabold">Please click here to begin</p>
    </>
  );
}
