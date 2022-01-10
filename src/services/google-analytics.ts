import { VerificationFragment } from "@govtechsg/oa-verify";
import { OpenAttestationDocument } from "@govtechsg/open-attestation";
import get from "lodash.get";
import { useEffect } from "react";
import ReactGA from "react-ga4";

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
      console.error(error);
    }
  }, []);
};

enum HEALTHCERT_TYPE {
  PDT = "PDT",
  VAC = "VAC",
}

const isVac = (data: OpenAttestationDocument): boolean => get(data, "name") === "VaccinationHealthCert";
const isPDT = (data: OpenAttestationDocument): boolean =>
  get(data, "name") === "HealthCert" || get(data, "version") === "pdt-healthcert-v2.0";
export const isHealthCert = (data: OpenAttestationDocument): boolean => isVac(data) || isPDT(data);

export const getHealthCertType = (data: OpenAttestationDocument): HEALTHCERT_TYPE | "" => {
  if (isVac(data)) {
    return HEALTHCERT_TYPE.VAC;
  } else if (isPDT(data)) {
    return HEALTHCERT_TYPE.PDT;
  }
  return "";
};

enum EVENT_CATEGORY {
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
