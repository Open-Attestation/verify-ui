import { useEffect } from "react";
import ReactGA from "react-ga4";

const GTAG_ID = process.env.REACT_APP_GTAG_ID;

export const useGoogleAnalytics = (): void => {
  /* Initialise Google Analytics 4 if GTAG_ID is provided */
  useEffect(() => {
    if (GTAG_ID?.startsWith("G-")) {
      ReactGA.initialize(GTAG_ID);
      ReactGA.send("pageview");
    }
  }, []);
};
