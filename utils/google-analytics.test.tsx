import { render } from "@testing-library/react";
import ReactGA from "react-ga4";
import { getData } from "@govtechsg/open-attestation";
import { ErrorVerificationFragment, InvalidVerificationFragment } from "@govtechsg/oa-verify";

import {
  EVENT_CATEGORY,
  DOCUMENT_TYPE,
  getDocumentType,
  useGoogleAnalytics,
  sendSuccessfulVerificationEvent,
  sendUnsuccessfulVerificationEvent,
} from "@utils/google-analytics";
import { isHealthCert } from "@utils/notarise-healthcerts";
import pdt_v1 from "@utils/fixtures/pdt_v1_healthcert.json";
import pdt_v2 from "@utils/fixtures/pdt_v2_healthcert.json";
import pdt_v2_invalid from "@utils/fixtures/pdt_v2_healthcert_invalid.json";
import vac_v1 from "@utils/fixtures/vac_v1_healthcert.json";
import tt_bill from "@utils/fixtures/tt_bill_of_lading.json";

describe("test useGoogleAnalytics hook", () => {
  it("reactGA should be initialized when NEXT_PUBLIC_GTAG_ID starts with G", () => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_GTAG_ID: "G-TEST",
    };
    const Container: React.FC = () => {
      useGoogleAnalytics();
      return null;
    };

    const spy = jest.spyOn(ReactGA, "initialize");
    render(<Container />);
    expect(spy).toHaveBeenCalledWith("G-TEST");
    process.env = originalEnv;
  });
});

describe("test isHealthCert() util functions", () => {
  it("isHealthCert() should return true for v1 pdt", () => {
    const data = getData(pdt_v1 as any);
    expect(isHealthCert(data)).toBeTruthy();
  });
  it("isHealthCert() should return true for v2 pdt", () => {
    const data = getData(pdt_v2 as any);
    expect(isHealthCert(data)).toBeTruthy();
  });
  it("isHealthCert() should return true for vac cert", () => {
    const data = getData(vac_v1 as any);
    expect(isHealthCert(data)).toBeTruthy();
  });
  it("isHealthCert() should return false for trade trust cert", () => {
    const data = getData(tt_bill as any);
    expect(isHealthCert(data)).toBeFalsy();
  });
});

describe("test getHealthCertType() util function", () => {
  it("getHealthCertType() for v1 pdt should return pdt", () => {
    const data = getData(pdt_v1 as any);
    expect(getDocumentType(data)).toBe(DOCUMENT_TYPE.PDT);
  });

  it("getHealthCertType() for v2 pdt should return pdt", () => {
    const data = getData(pdt_v2 as any);
    expect(getDocumentType(data)).toBe(DOCUMENT_TYPE.PDT);
  });
  it("getHealthCertType() for vac cert should return pdt", () => {
    const data = getData(vac_v1 as any);
    expect(getDocumentType(data)).toBe(DOCUMENT_TYPE.VAC);
  });
  it("getHealthCertType() for non health cert should return OA_V2", () => {
    const data = getData(tt_bill as any);
    expect(getDocumentType(data)).toBe("OA_V2");
  });
});

describe("sendHealthCertVerifiedEvent and sendHealthCertErrorEvent", () => {
  it("sendHealthCertVerifiedEvent should send document id and type", () => {
    const data = getData(pdt_v2 as any);
    const spy = jest.spyOn(ReactGA, "event");
    sendSuccessfulVerificationEvent(data);
    expect(spy).toHaveBeenCalledWith(EVENT_CATEGORY.VERIFIED, {
      document_id: "9867890e-6ad8-4735-b705-1ccd441984f8",
      document_type: DOCUMENT_TYPE.PDT,
      issuer_identity_location: "donotverify.testing.verify.gov.sg",
      template_name: "HEALTH_CERT",
      template_url: "https://healthcert.renderer.moh.gov.sg/",
    });
  });

  it("sendHealthCertErrorEvent should send document id, type and error message", async () => {
    const data = getData(pdt_v2_invalid as any);
    const fragments: (ErrorVerificationFragment<any> | InvalidVerificationFragment<any>)[] = [
      {
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY",
        status: "ERROR",
        data: {},
        reason: {
          message: "Some error",
          code: 1,
          codeString: "Some error",
        },
      },
      {
        name: "OpenAttestationDnsDidIdentityProof",
        type: "ISSUER_IDENTITY",
        status: "INVALID",
        data: {},
        reason: {
          message: "Other error",
          code: 2,
          codeString: "Other error",
        },
      },
    ];
    const spy = jest.spyOn(ReactGA, "event");
    sendUnsuccessfulVerificationEvent(data, fragments);
    const message = JSON.stringify(
      fragments.filter(({ status }) => status === "ERROR" || status === "INVALID")
    ).replace(/[\[\]"]/g, "");
    expect(spy).toHaveBeenCalledWith(EVENT_CATEGORY.ERROR, {
      document_id: "9867890e-6ad8-4735-b705-1ccd441984f8",
      document_type: DOCUMENT_TYPE.PDT,
      issuer_identity_location: "donotverify.testing.verify.gov.sg",
      template_name: "HEALTH_CERT",
      template_url: "https://healthcert.renderer.moh.gov.sg/",
      errors: message,
    });
  });
});
