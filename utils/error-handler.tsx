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
  else if (axios.isAxiosError(e) && isNotariseSpmTransientStorage(e.config.url)) {
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
