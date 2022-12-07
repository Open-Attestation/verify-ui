import { useState } from "react";
import type { NextPage } from "next";

import Layout from "@components/layout/Layout";
import Heading from "@components/text/Heading";
import QrScanner from "@components/verify/QrScanner";

const SCAN_MODES = ["Camera 1", "Camera 2", "barcode scanner"];

const Qr: NextPage = () => {
  const [currentMode, setCurrentMode] = useState<number>(0);

  const remainingModes = () => {
    return (
      <div className="flex flex-row gap-2 pb-4">
        {SCAN_MODES.map((mode, i) => {
          if (currentMode === i) return;
          return (
            <div
              onClick={() => {
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

  return (
    <Layout>
      <section className="container text-center my-10 pb-2 mx-auto">
        <Heading level="h1">Scan Verify QR</Heading>
        <p>Show the Verify QR in front of the camera or scanner</p>

        <div className="md:mx-40 my-10 py-10 border-4 border-dashed rounded-lg bg-white ring-primary shadow-xl">
          <div className="flex flex-col items-center">
            <div className="flex flex-row gap-2">
              <div>Current scan mode: </div>
              <div className="font-bold">{SCAN_MODES[currentMode]}</div>
            </div>
            {remainingModes()}
            <QrScanner currentMode={currentMode}></QrScanner>
            <div className="flex flex-col pt-10">
              <div>If you have problems scanning the QR, you may want to verify by</div>
              <a
                href="/verify"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-700"
              >
                uploading your OA certificate
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Qr;
