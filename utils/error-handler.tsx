import axios from "axios";

import { CodedError } from "@utils/coded-error";
import { StatusProps } from "@components/figure/Status";

/**
 * Error handler for the Verify page (pages/verify.tsx)
 * @param e
 */
export const verifyErrorHandler = (e: unknown): StatusProps => {
  if (e instanceof CodedError) {
    return {
      type: "ERROR",
      message: (
        <div className="text-center">
          ${e.type}: ${[e.message, e.details].join(" - ")}
        </div>
      ),
    };
  } else if (axios.isAxiosError(e)) {
    const isSpmTransientStorage = (url = "") => url?.startsWith("https://api-spm-vac.storage.aws.notarise.gov.sg");
    return {
      type: "ERROR",
      message: isSpmTransientStorage(e.config.url) ? (
        <div className="flex flex-col items-center gap-10 text-center">
          Unable to fetch document.
          <br />
          Please click on the refresh icon on the top right of your Singpass QR code and try again.
          <img src="/images/spm-refresh-button.png" alt="SPM screenshot of refresh button" />
        </div>
      ) : (
        <div className="text-center">
          {e.message}: Unable to fetch document from
          <br />
          <span className="text-xs break-all">{e.config.url}</span>
        </div>
      ),
    };
  }

  return { type: "ERROR", message: <>Something went wrong.</> };
};
