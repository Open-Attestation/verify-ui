import { VerificationFragment } from "@govtechsg/oa-verify";
import { OpenAttestationDocument } from "@govtechsg/open-attestation";
import { useEffect } from "react";
import ReactGA from "react-ga4";

import { isHealthCert, isPDT, isVac, isREC } from "@utils/notarise-healthcerts";

export enum HEALTHCERT_TYPE {
  PDT = "PDT",
  VAC = "VAC",
  REC = "REC",
  UNKNOWN = "UNKNOWN",
}

export enum EVENT_CATEGORY {
  VERIFIED = "certificate_verified",
  ERROR = "certificate_error",
}

export const getHealthCertType = (data: OpenAttestationDocument): HEALTHCERT_TYPE => {
  if (isVac(data)) {
    return HEALTHCERT_TYPE.VAC;
  } else if (isPDT(data)) {
    return HEALTHCERT_TYPE.PDT;
  } else if (isREC(data)) {
    return HEALTHCERT_TYPE.REC;
  } else {
    return HEALTHCERT_TYPE.UNKNOWN;
  }
};

/**
 * Initialise Google Analytics 4 only once (if GTAG_ID is provided)
 *
 * The ReactGA.send("pageview") is explicitly called afterwards because
 * the pageview event is not automatically triggered on first initialisation
 * but will be automatically triggered by the GA script on subsequent page views.
 */
export const useGoogleAnalytics = (): void => {
  useEffect(() => {
    try {
      const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;
      if (GTAG_ID?.startsWith("G-")) {
        ReactGA.initialize(GTAG_ID);
        ReactGA.send("pageview");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
};

export const sendHealthCertVerifiedEvent = (data: OpenAttestationDocument): void => {
  if (!isHealthCert(data)) {
    return;
  }
  try {
    ReactGA.event(EVENT_CATEGORY.VERIFIED, {
      document_id: data.id ?? "",
      document_type: getHealthCertType(data),
    });
  } catch (e) {
    console.error(e);
  }
};

export const sendHealthCertErrorEvent = (data: OpenAttestationDocument, fragments: VerificationFragment[]): void => {
  if (!isHealthCert(data)) {
    return;
  }
  const message = JSON.stringify(fragments.filter(({ status }) => status === "ERROR" || status === "INVALID")).replace(
    /[\[\]"]/g,
    ""
  );
  try {
    ReactGA.event(EVENT_CATEGORY.ERROR, {
      document_id: data.id ?? "",
      document_type: getHealthCertType(data),
      errors: message,
    });
  } catch (e) {
    console.error(e);
  }
};
