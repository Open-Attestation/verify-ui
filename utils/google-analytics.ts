import { VerificationFragment } from "@govtechsg/oa-verify";
import { OpenAttestationDocument, utils } from "@govtechsg/open-attestation";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import type { GA4 } from "react-ga4/types/ga4";

import { isPDT, isVac, isREC } from "@utils/notarise-healthcerts";

export enum DOCUMENT_TYPE {
  PDT = "PDT",
  VAC = "VAC",
  REC = "REC",
  OA_V2 = "OA_V2",
  OA_V3 = "OA_V3", // OA v3 currently not supported by verify.gov.sg
  UNKNOWN = "UNKNOWN",
}

export enum EVENT_CATEGORY {
  VERIFIED = "certificate_verified",
  ERROR = "certificate_error",
  PRINT = "certificate_print",
}

export const getDocumentType = (data: OpenAttestationDocument): DOCUMENT_TYPE => {
  if (isVac(data)) {
    return DOCUMENT_TYPE.VAC;
  } else if (isPDT(data)) {
    return DOCUMENT_TYPE.PDT;
  } else if (isREC(data)) {
    return DOCUMENT_TYPE.REC;
  } else if (utils.isRawV2Document(data)) {
    return DOCUMENT_TYPE.OA_V2;
  } else if (utils.isRawV3Document(data)) {
    return DOCUMENT_TYPE.OA_V3;
  } else {
    return DOCUMENT_TYPE.UNKNOWN;
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
      const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID || "G-40G8RLK2GF";
      if (GTAG_ID?.startsWith("G-")) {
        ReactGA.initialize(GTAG_ID);
        ReactGA.send("pageview");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
};

export const sendCertificatePrintEvent = (
  data: OpenAttestationDocument,
  params?: { isSupportedBrowser: boolean }
): void => {
  sendGaEvent(EVENT_CATEGORY.PRINT, data, { supported_browser: params?.isSupportedBrowser });
};

export const sendSuccessfulVerificationEvent = (data: OpenAttestationDocument): void => {
  sendGaEvent(EVENT_CATEGORY.VERIFIED, data);
};

export const sendUnsuccessfulVerificationEvent = (
  data: OpenAttestationDocument,
  fragments: VerificationFragment[]
): void => {
  const message = JSON.stringify(fragments.filter(({ status }) => status === "ERROR" || status === "INVALID")).replace(
    /[\[\]"]/g,
    ""
  );

  sendGaEvent(EVENT_CATEGORY.ERROR, data, { errors: message });
};

const sendGaEvent = (
  category: EVENT_CATEGORY,
  data: OpenAttestationDocument,
  params: Parameters<GA4["event"]>[1] = {}
) => {
  if (utils.isRawV3Document(data)) return; // OA v3 currently not supported by verify.gov.sg

  try {
    ReactGA.event(category, {
      document_id: data.id || "",
      document_type: getDocumentType(data),
      issuer_name: data.issuers[0].name || "",
      issuer_identity_location: data.issuers[0].identityProof?.location || "",
      template_name: typeof data.$template === "string" ? data.$template : data.$template?.name || "",
      template_url: typeof data.$template === "string" ? data.$template : data.$template?.url || "",
      ...params,
    });
  } catch (e) {
    console.error(e);
  }
};
