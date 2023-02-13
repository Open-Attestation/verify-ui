import { useEffect, useReducer, Dispatch, Reducer } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";

import Layout from "@components/layout/Layout";
import Heading from "@components/text/Heading";
import Status, { StatusProps } from "@components/figure/StatusMessage";
import { CameraScanner, getCameraDevices } from "@components/verify/CameraScanner";
import BarcodeScanner from "@components/verify/BarcodeScanner";
import { qrErrorHandler } from "@utils/error-handler";

type AvailableDevice = MediaDeviceInfo | "Barcode Scanner";

interface State {
  isReady: boolean;
  status: StatusProps;
  availableDevices: AvailableDevice[];
  selectedDevice: AvailableDevice;
}

type Action =
  | { type: "READY"; availableDevices: AvailableDevice[]; selectedDevice: AvailableDevice }
  | { type: "SCAN_WITH_CAMERA"; selectedDevice: MediaDeviceInfo }
  | { type: "SCAN_WITH_BARCODE" }
  | { type: "STATUS_MESSAGE"; status: StatusProps }
  | { type: "LAUNCH_VERIFY_URL"; url: URL };

const initialState: State = {
  isReady: false,
  status: { type: "LOADING", message: <>Looking for available cameras...</> },
  availableDevices: ["Barcode Scanner"],
  selectedDevice: "Barcode Scanner",
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "READY":
      return {
        isReady: true,
        status: { type: "NIL" },
        availableDevices: action.availableDevices,
        selectedDevice: action.selectedDevice,
      };
    case "SCAN_WITH_CAMERA":
      return { ...state, selectedDevice: action.selectedDevice, status: { type: "NIL" } };
    case "SCAN_WITH_BARCODE":
      return { ...state, selectedDevice: "Barcode Scanner", status: { type: "NIL" } };
    case "STATUS_MESSAGE":
      return { ...state, status: action.status };
    case "LAUNCH_VERIFY_URL":
      window.open(action.url, "_blank", "resizable,width=720,height=960");
      return { ...state, status: { type: "NIL" } };
    default:
      return initialState;
  }
};

const Qr: NextPage = () => {
  const [{ isReady, status, availableDevices, selectedDevice }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const availableCameras = await getCameraDevices();
        const availableDevices: AvailableDevice[] = [...availableCameras, "Barcode Scanner"];
        dispatch({ type: "READY", availableDevices, selectedDevice: availableDevices[0] });
      } catch (e) {
        console.error(e);

        // Fallback to "Barcode Scanner"
        dispatch({ type: "READY", availableDevices: ["Barcode Scanner"], selectedDevice: "Barcode Scanner" });
        dispatch({ type: "STATUS_MESSAGE", status: qrErrorHandler(e) });
      }
    })();
  }, [isReady]);

  const onResult = (url: string) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.origin !== "https://www.verify.gov.sg") {
        throw new Error(`Invalid Verify QR, please try again: ${url}`);
      }

      dispatch({ type: "LAUNCH_VERIFY_URL", url: parsedUrl });
    } catch (e) {
      console.error(e);

      dispatch({
        type: "STATUS_MESSAGE",
        status: {
          type: "ERROR",
          message: <>Invalid Verify QR, please try again</>,
        },
      });
    }
  };

  return (
    <Layout>
      <NextSeo title="QR Scanner" />
      <section className="container text-center my-10 pb-2 mx-auto">
        <Heading level="h1">Scan Verify QR</Heading>
        <p>Show the Verify QR in front of the camera or scanner</p>

        <Status {...status} />

        <div
          hidden={!isReady}
          className="p-6 my-10 border-4 border-dotted border-gray-200 rounded-lg bg-white ring-primary"
        >
          {/* Mode selection */}
          <div className="pb-4">
            Current scan mode:{" "}
            <span className="font-bold">
              {selectedDevice === "Barcode Scanner"
                ? selectedDevice
                : selectedDevice.label.replace(/\s[(].{4}:.{4}[)]/, "")}
            </span>
          </div>
          <ul className="flex flex-wrap justify-center gap-2">
            <DeviceSelection availableDevices={availableDevices} selectedDevice={selectedDevice} dispatch={dispatch} />
          </ul>

          {/* Camera or barcode scanner */}
          {selectedDevice === "Barcode Scanner" ? (
            <BarcodeScanner onResult={onResult} />
          ) : (
            <CameraScanner constraints={{ deviceId: selectedDevice?.deviceId }} onResult={onResult} />
          )}

          <p className="m-0">
            If you have problems scanning the QR, you may want to verify by <br />
            <Link href="/verify">
              <a target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-700">
                uploading your OA certificate
              </a>
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Qr;

interface DeviceSelectionProps {
  availableDevices: AvailableDevice[];
  selectedDevice: AvailableDevice;
  dispatch: Dispatch<Action>;
}

const DeviceSelection: React.FC<DeviceSelectionProps> = ({ availableDevices, selectedDevice, dispatch }) => (
  <>
    {availableDevices
      .filter((device) => selectedDevice !== device)
      .map((device, i) => (
        <li
          key={i}
          className="text-blue-600 underline cursor-pointer"
          onClick={
            device === "Barcode Scanner"
              ? () => {
                  dispatch({ type: "SCAN_WITH_BARCODE" });
                }
              : () => dispatch({ type: "SCAN_WITH_CAMERA", selectedDevice: device })
          }
        >
          {device === "Barcode Scanner"
            ? `Switch to Barcode Scanner`
            : `Switch to ${device.label.replace(/\s[(].{4}:.{4}[)]/, "")}`}
        </li>
      ))}
  </>
);
