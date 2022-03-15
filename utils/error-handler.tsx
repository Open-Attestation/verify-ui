import axios from "axios";

import { CodedError } from "@utils/coded-error";
import { ErrorProps } from "@components/figure/ErrorMessage";

/**
 * Error handler for the Verify page (pages/verify.tsx)
 * @param e
 */
export const verifyErrorHandler = (e: unknown): ErrorProps => {
  if (e instanceof CodedError) {
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
  } else if (e instanceof Error) {
    return {
      type: "ERROR",
      message: (
        <div className="text-center">
          {e.name}: {e.message}
        </div>
      ),
    };
  }

  return { type: "ERROR", message: <>Something went wrong.</> };
};
