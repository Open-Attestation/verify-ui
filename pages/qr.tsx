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
import { useRouterQuery } from "@utils/router-query-hook";
import WogaaScript from "@components/layout/WogaaScript";

const barcodeScanner = { prettyLabel: "Barcode Scanner" } as const;

type BarcodeScanner = typeof barcodeScanner;
type AvailableDevices = (CustomMediaDeviceInfo | BarcodeScanner)[];

interface State {
  status: StatusProps;
  availableDevices?: AvailableDevices;
}

type Action =
  | { type: "SET_AVAILABLE_DEVICES"; availableDevices: AvailableDevices }
  | { type: "STATUS_MESSAGE"; status: StatusProps }
  | { type: "RESET_STATUS_MESSAGE" };

const initialState: State = {
  status: { type: "LOADING", message: <>Looking for available cameras...</> },
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "SET_AVAILABLE_DEVICES":
      return {
        status: { type: "NIL" },
        availableDevices: action.availableDevices,
      };
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
  const [deviceQueryParam, setDeviceQueryParam, isRouterReady] = useRouterQuery("device");
  const [{ status, availableDevices }, dispatch] = useReducer(reducer, initialState);
  const isReady = !!availableDevices && !!deviceQueryParam;

  /* Initialisation (on first render): Populate list of available cameras */
  useEffect(() => {
    (async () => {
      try {
        const availableCameras = await getFilteredCameraDevices();
        const availableDevices = [...availableCameras, barcodeScanner];

        dispatch({ type: "SET_AVAILABLE_DEVICES", availableDevices });
      } catch (e) {
        console.error(e);

        /* Unable to get cameras: Fallback to "Barcode Scanner" */
        dispatch({ type: "SET_AVAILABLE_DEVICES", availableDevices: [barcodeScanner] });
        dispatch({ type: "STATUS_MESSAGE", status: qrErrorHandler(e) });
      }
    })();
  }, []);

  /* On router ready and available devices populated: Select device based on query parameter */
  useEffect(() => {
    if (!isRouterReady || !availableDevices) return;

    /* If no device or an unknown device is selected, default to first device */
    if (!deviceQueryParam || !availableDevices.some((device) => device.prettyLabel === deviceQueryParam)) {
      setDeviceQueryParam(availableDevices[0].prettyLabel);
    }
  }, [isRouterReady, availableDevices, deviceQueryParam]);

  const onResult = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const SITE_URL = process.env.SITE_URL; // See "next.config.js"
      const allowedOrigins = [
        SITE_URL,
        "https://action.openattestation.com",
        "https://www.verify.gov.sg",
        "https://www.trustdocs.gov.sg",
      ];

      if (!allowedOrigins.some((origin) => origin === parsedUrl.origin)) {
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
      <WogaaScript />
      <NextSeo title="QR Scanner" />
      <section className="container text-center my-10 pb-2 mx-auto">
        <Heading level="h1">Scan Verify QR Code</Heading>
        <p>Place the Verify QR code in front of the camera or scanner</p>

        <Status {...status} />

        {isReady && (
          <div className="relative p-6 my-10 border-4 border-dotted border-gray-200 rounded-lg bg-white ring-primary">
            {/* Blur component */}
            <BlurWhenUnfocused isWindowFocused={isWindowFocused} />

            {/* Mode selection */}
            <div className="pb-4">
              Current scan mode: <span className="font-bold">{deviceQueryParam}</span>
            </div>
            <ul className="flex flex-wrap justify-center gap-2">
              <DeviceSelection
                availableDevices={availableDevices}
                selectedDevice={availableDevices.find((device) => device.prettyLabel === deviceQueryParam)}
                onSelectedDevice={(prettyLabel) => {
                  setDeviceQueryParam(prettyLabel);
                }}
              />
            </ul>

            {/* Camera or barcode scanner */}
            {deviceQueryParam === barcodeScanner.prettyLabel ? (
              <BarcodeScanner onResult={onResult} />
            ) : (
              <CameraScanner
                cameraDevice={availableDevices
                  .filter((device): device is CustomMediaDeviceInfo => device !== barcodeScanner)
                  .find((camera) => camera.prettyLabel === deviceQueryParam)}
                onResult={onResult}
              />
            )}

            <p className="m-0">
              If you have problems scanning the QR code, you may want to verify by <br />
              <Link
                href="/verify"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-700"
              >
                uploading your OA certificate
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
  availableDevices: (CustomMediaDeviceInfo | BarcodeScanner)[];
  selectedDevice?: CustomMediaDeviceInfo | BarcodeScanner;
  onSelectedDevice: (selectedDevicePrettyLabel: string) => void;
}

const DeviceSelection: React.FC<DeviceSelectionProps> = ({ availableDevices, selectedDevice, onSelectedDevice }) => (
  <>
    {availableDevices
      .filter((device) => device !== selectedDevice)
      .map((device, i) => (
        <li
          key={i}
          className="text-blue-600 underline cursor-pointer"
          onClick={() => {
            onSelectedDevice(device.prettyLabel);
          }}
        >
          Switch to {device.prettyLabel}
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
