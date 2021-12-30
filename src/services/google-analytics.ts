import { useEffect } from "react";
import ReactGA from "react-ga4";
import { UaEventOptions } from "react-ga4/types/ga4";
import useDeepCompareEffect from "use-deep-compare-effect";

const GTAG_ID = process.env.REACT_APP_GTAG_ID;

export const useGoogleAnalytics = (): void => {
  /* Initialise Google Analytics 4 if GTAG_ID is provided */
  useEffect(() => {
    try {
      if (GTAG_ID?.startsWith("G-")) {
        ReactGA.initialize(GTAG_ID);
        ReactGA.send("pageview");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
};

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
};
