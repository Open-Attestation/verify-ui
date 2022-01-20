import { VerificationFragment } from "@govtechsg/oa-verify";
import { OpenAttestationDocument } from "@govtechsg/open-attestation";
import { useEffect } from "react";
import ReactGA from "react-ga4";

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
      const GTAG_ID = process.env.REACT_APP_GTAG_ID;
      if (GTAG_ID?.startsWith("G-")) {
        ReactGA.initialize(GTAG_ID);
        ReactGA.send("pageview");
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
};

export enum HEALTHCERT_TYPE {
  PDT = "PDT",
  VAC = "VAC",
  UNKNOWN = "UNKNOWN",
}

const isVac = (data: any): boolean => data?.name === "VaccinationHealthCert";
const isPDT = (data: any): boolean => data?.name === "HealthCert" || data?.version === "pdt-healthcert-v2.0";
export const isHealthCert = (data: OpenAttestationDocument): boolean => isVac(data) || isPDT(data);

export const getHealthCertType = (data: OpenAttestationDocument): HEALTHCERT_TYPE => {
  if (isVac(data)) {
    return HEALTHCERT_TYPE.VAC;
  } else if (isPDT(data)) {
    return HEALTHCERT_TYPE.PDT;
  } else {
    return HEALTHCERT_TYPE.UNKNOWN;
  }
};

export enum EVENT_CATEGORY {
  VERIFIED = "certificate_verified",
  ERROR = "certificate_error",
}

export const sendHealthCertVerifiedEvent = (data: OpenAttestationDocument): void => {
  if (!isHealthCert(data)) {
    return;
  }
  try {
    ReactGA.event(EVENT_CATEGORY.VERIFIED, {
      document_id: data.id ?? "",
      document_type: getHealthCertType(data),
    });
  } catch (error) {
    console.error(error);
  }
};

export const sendHealthCertErrorEvent = (data: OpenAttestationDocument, fragments: VerificationFragment[]): void => {
  if (!isHealthCert(data)) {
    return;
  }
  const message: string = JSON.stringify(fragments.filter(({ status }) => status === "ERROR" || status === "INVALID"));
  try {
    ReactGA.event(EVENT_CATEGORY.ERROR, {
      document_id: data.id ?? "",
      document_type: getHealthCertType(data),
      errors: message,
    });
  } catch (error) {
    console.error(error);
  }
};
