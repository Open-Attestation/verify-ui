import axios from "axios";

import { CodedError } from "@utils/coded-error";
import { isNotariseSpmTransientStorage } from "@utils/notarise-healthcerts";
import { StatusProps } from "@components/figure/StatusMessage";

/**
 * Custom error message handler for the Verify page (pages/verify.tsx)
 * @param e
 */
export const verifyErrorHandler = (e: unknown): StatusProps => {
  if (e instanceof CodedError) {
    if (e.type === "HealthCertsTransientStorageDecommError") {
      return {
        type: "ERROR",
        message: (
          <div className="flex flex-col lg:px-52">
            <span className="font-semibold">Unable to fetch certificate</span>
            <br />
            <div>
              As most countries have lifted entry and domestic requirements related to COVID-19, Notαrise will stop
              issuing and hosting digital HealthCerts as of 1 May 2024.&nbsp;
              <a href="https://www.notarise.gov.sg/faq" target="_blank" className="underline">
                Learn more on your existing HealthCerts and other means of getting travel certificates.
              </a>
            </div>
          </div>
        ),
      };
    }
    return {
      type: "ERROR",
      message: (
        <div className="text-center">
          {e.type}: {e.message}
          {e.details && <br />}
          {e.details && <span className="break-words">{e.details}</span>}
        </div>
      ),
    };
  }
  // isNotariseSpmTransientStorage() has to be checked first because isNotariseTransientStorage() encompasses SPM URLs as well
  else if (axios.isAxiosError(e) && isNotariseSpmTransientStorage(e.config?.url)) {
    return {
      type: "ERROR",
      message: (
        <div className="flex flex-col items-center gap-10 text-center">
          Unable to fetch document.
          <br />
          Please click on the refresh icon on the top right of your Singpass QR code and try again.
          <img src="/images/spm-refresh-button.png" alt="SPM screenshot of refresh button" />
        </div>
      ),
    };
  } else if (axios.isAxiosError(e)) {
    return {
      type: "ERROR",
      message: (
        <div className="text-left">
          <b>An error occurred while displaying your document. Please ensure</b>:
          <ol className="list-decimal my-4 ml-4">
            <li>Your internet connection is available, and you are not behind a corporate or personal firewall</li>
            <li>Alternatively, you may request for a new document to be issued</li>
          </ol>
        </div>
      ),
    };
  } else if (e instanceof Error) {
    return {
      type: "ERROR",
      message: (
        <div className="text-center">
          {e.name}: {e.message}
        </div>
      ),
    };
  } else {
    return { type: "ERROR", message: <>Something went wrong.</> };
  }
};

/**
 * Custom error message handler for the QR page (pages/qr.tsx)
 * @param e
 */
export const qrErrorHandler = (e: unknown): StatusProps => {
  if (e instanceof DOMException && e.message.includes("Permission")) {
    return {
      type: "ERROR",
      message: (
        <div>
          <b>Camera permissions denied</b>: <br />
          Please grant camera permissions in your browser settings and refresh the page.
        </div>
      ),
    };
  } else if (e instanceof DOMException) {
    return {
      type: "ERROR",
      message: (
        <div>
          Please ensure your camera is connected, installed properly, and not in use by other applications.
          <br />
          Refresh the page after connecting your camera.
        </div>
      ),
    };
  } else if (e instanceof TypeError && e.message.includes("Invalid URL")) {
    return {
      type: "ERROR",
      message: <>Invalid Verify QR, please try again</>,
    };
  } else if (e instanceof CodedError) {
    return {
      type: "ERROR",
      message: (
        <div className="text-center">
          <b>{e.message}</b>
          {e.details && <br />}
          {e.details && <span className="break-words">{e.details}</span>}
        </div>
      ),
    };
  } else {
    return { type: "ERROR", message: <>Something went wrong.</> };
  }
};
