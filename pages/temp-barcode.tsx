import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useEffect, useRef, useState, KeyboardEventHandler } from "react";

import Layout from "@components/layout/Layout";

const TempBarcode: NextPage = () => {
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

  /* Clear input field if there are no edits for 1 second */
  useEffect(() => {
    // TODO: Use debounce?
  }, []);

  const onSubmit = () => {
    // TODO: [Validation] Check if valid URL and domain = verify.gov.sg then redirect
    window.open(barcodeInput, "_blank", "resizable,width=720,height=960");
    setBarcodeInput("");
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") return onSubmit();
  };

  return (
    <Layout className="container py-12 min-h-[75vh] bg-[length:450px] bg-right-top bg-no-repeat">
      <NextSeo title="Temp: Barcode Scanner" />
      <h2>Barcode scanner</h2>

      {isFocused ? (
        <p className="text-xl text-green-500 font-extrabold">Ready, waiting for scan</p>
      ) : (
        <p className="text-xl text-red-500 font-extrabold">Click here to begin</p>
      )}

      <input
        className="w-full bg-blue-100 opacity-50"
        value={barcodeInput}
        onChange={(e) => setBarcodeInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={inputRef}
        autoFocus
      />
    </Layout>
  );
};

export default TempBarcode;
