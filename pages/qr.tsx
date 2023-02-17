import { useEffect, useReducer, Dispatch, Reducer } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";

import Layout from "@components/layout/Layout";
import Heading from "@components/text/Heading";
import Status, { StatusProps } from "@components/figure/StatusMessage";
import { CameraScanner, getFilteredCameraDevices, CustomMediaDeviceInfo } from "@components/verify/CameraScanner";
import BarcodeScanner from "@components/verify/BarcodeScanner";
import { CodedError } from "@utils/coded-error";
import { qrErrorHandler } from "@utils/error-handler";
import { useWindowFocus } from "@utils/window-focus-hook";

type AvailableDevice = CustomMediaDeviceInfo | "Barcode Scanner";

interface State {
  isReady: boolean;
  status: StatusProps;
  availableDevices: AvailableDevice[];
  selectedDevice: AvailableDevice;
}

type Action =
  | { type: "READY"; availableDevices: AvailableDevice[] }
  | { type: "SCAN_WITH_CAMERA"; selectedDevice: CustomMediaDeviceInfo }
  | { type: "SCAN_WITH_BARCODE" }
  | { type: "STATUS_MESSAGE"; status: StatusProps }
  | { type: "RESET_STATUS_MESSAGE" };

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
        selectedDevice: action.availableDevices[0],
      };
    case "SCAN_WITH_CAMERA":
      return { ...state, selectedDevice: action.selectedDevice, status: { type: "NIL" } };
    case "SCAN_WITH_BARCODE":
      return { ...state, selectedDevice: "Barcode Scanner", status: { type: "NIL" } };
    case "STATUS_MESSAGE":
      return { ...state, status: action.status };
    case "RESET_STATUS_MESSAGE":
      return { ...state, status: { type: "NIL" } };
    default:
      return initialState;
  }
};

const Qr: NextPage = () => {
  const isWindowFocused = useWindowFocus();
  const [{ isReady, status, availableDevices, selectedDevice }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const availableCameras = await getFilteredCameraDevices();

        dispatch({ type: "READY", availableDevices: ["Barcode Scanner", ...availableCameras] }); // FIXME: Since camera does not launch on first render for some devices (e.g. iPhone), workaround is to set Barcode Scanner as the default mode
      } catch (e) {
        console.error(e);

        /* Unable to get cameras: Fallback to "Barcode Scanner" */
        dispatch({ type: "READY", availableDevices: ["Barcode Scanner"] });
        dispatch({ type: "STATUS_MESSAGE", status: qrErrorHandler(e) });
      }
    })();
  }, [isReady]);

  const onResult = (url: string) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.origin !== "https://www.verify.gov.sg") {
        throw new CodedError("InvalidDocumentError", "Invalid Verify QR, please try again");
      }

      const newWindow = window.open(parsedUrl, "_blank", "resizable,width=720,height=960");

      if (!newWindow) {
        throw new CodedError(
          "PermissionsError",
          "Pop-ups are being blocked",
          "Please allow pop-ups in your browser settings and refresh the page"
        );
      }

      /* Success: All validations have passed */
      newWindow.focus();
    } catch (e) {
      console.error(e);

      dispatch({
        type: "STATUS_MESSAGE",
        status: qrErrorHandler(e),
      });
    }
  };

  /* Clear error status message after 5 seconds */
  useEffect(() => {
    if (status.type !== "ERROR") return;

    const timer = setTimeout(() => dispatch({ type: "RESET_STATUS_MESSAGE" }), 5000);

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <Layout>
      <NextSeo title="QR Scanner" />
      <section className="container text-center my-10 pb-2 mx-auto">
        <Heading level="h1">Scan Verify QR</Heading>
        <p>Show the Verify QR in front of the camera or scanner</p>

        <Status {...status} />

        {isReady && (
          <div className="relative p-6 my-10 border-4 border-dotted border-gray-200 rounded-lg bg-white ring-primary">
            {/* Blur component */}
            <BlurWhenUnfocused isWindowFocused={isWindowFocused} />

            {/* Mode selection */}
            <div className="pb-4">
              Current scan mode:{" "}
              <span className="font-bold">
                {selectedDevice === "Barcode Scanner" ? selectedDevice : selectedDevice.prettyLabel}
              </span>
            </div>
            <ul className="flex flex-wrap justify-center gap-2">
              <DeviceSelection
                availableDevices={availableDevices}
                selectedDevice={selectedDevice}
                dispatch={dispatch}
              />
            </ul>

            {/* Camera or barcode scanner */}
            {selectedDevice === "Barcode Scanner" ? (
              <BarcodeScanner onResult={onResult} />
            ) : (
              <CameraScanner constraints={{ deviceId: selectedDevice.device.deviceId }} onResult={onResult} />
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
        )}
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
          {device === "Barcode Scanner" ? `Switch to Barcode Scanner` : `Switch to ${device.prettyLabel}`}
        </li>
      ))}
  </>
);

const BlurWhenUnfocused: React.FC<{ isWindowFocused: boolean }> = ({ isWindowFocused }) =>
  isWindowFocused ? null : (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm">
      <p className="text-xl sm:text-3xl font-semibold text-white bg-primary py-4 px-6 rounded-xl shadow-md cursor-pointer">
        Click here to resume
      </p>
    </div>
  );
