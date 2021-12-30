import { useEffect } from "react";
import ReactGA from "react-ga4";
import { UaEventOptions } from "react-ga4/types/ga4";
import useDeepCompareEffect from "use-deep-compare-effect";

const GTAG_ID = process.env.REACT_APP_GTAG_ID;

export const useGoogleAnalytics = (): void => {
  /* Initialise Google Analytics 4 if GTAG_ID is provided */
  useEffect(() => {
    try {
      console.log(GTAG_ID);
      if (GTAG_ID?.startsWith("G-")) {
        ReactGA.initialize(GTAG_ID);
        ReactGA.send("pageview");
        console.log("initialized ga");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
};

<<<<<<< HEAD
enum EVENT_CATEGORY {
  VERIFIED = "certificate_verified",
  ERROR = "certificate_error",
}

interface EventCertificateVerifiedParams {
  document_id: string;
  document_type: "PCR" | "ART" | "SER" | ["PCR", "SER"];
}
export const sendEventCertificateVerified = ({ document_id, document_type }: EventCertificateVerifiedParams): void => {
  ReactGA.event(EVENT_CATEGORY.VERIFIED, { document_id, document_type });
=======
interface GAEvent extends UaEventOptions {
  [arg: string]: any;
}
/* custom hook to send google analytics custom event whenever custom event changes */
export const useGaEvent = (params: GAEvent): void => {
  useDeepCompareEffect(() => {
    try {
      ReactGA.event(params);
    } catch (error) {
      console.log(error);
    }
  }, [params]);
>>>>>>> 52945c9 (chore: added error handling and customEvenHook)
};
