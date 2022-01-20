import { getData } from "@govtechsg/open-attestation";
import { render } from "@testing-library/react";
import React from "react";
import ReactGA from "react-ga4";
import { verify } from "../issuers-verifier";
import invalid_vac_cert from "./fixtures/invalid_v2_pdt_healthcert.json";
import tt_bill from "./fixtures/tt_bill_of_lading.json";
import v1_pdt from "./fixtures/v1_pdt_healthcert.json";
import v2_pdt from "./fixtures/v2_pdt_healthcert.json";
import vac_cert from "./fixtures/vac_cert.json";
import {
  getHealthCertType,
  HEALTHCERT_TYPE,
  isHealthCert,
  useGoogleAnalytics,
  sendHealthCertVerifiedEvent,
  EVENT_CATEGORY,
  sendHealthCertErrorEvent,
} from "./google-analytics";

describe("test useGoogleAnalytics hook", () => {
  it("reactGA should be initialized when REACT_APP_GTAG_ID starts with G", () => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      REACT_APP_GTAG_ID: "G-TEST",
    };
    console.log("test env", process.env.REACT_APP_GTAG_ID);
    const Container: React.FC = () => {
      useGoogleAnalytics();
      return <div />;
    };

    const spy = jest.spyOn(ReactGA, "initialize");
    render(<Container />);
    expect(spy).toHaveBeenCalledWith("G-TEST");
    process.env = originalEnv;
  });
});

describe("test isHealthCert() util functions", () => {
  it("isHealthCert() should return true for v1 pdt", () => {
    const data = getData(v1_pdt as any);
    expect(isHealthCert(data)).toBeTruthy();
  });
  it("isHealthCert() should return true for v2 pdt", () => {
    const data = getData(v2_pdt as any);
    expect(isHealthCert(data)).toBeTruthy();
  });
  it("isHealthCert() should return true for vac cert", () => {
    const data = getData(vac_cert as any);
    expect(isHealthCert(data)).toBeTruthy();
  });
  it("isHealthCert() should return false for trade trust cert", () => {
    const data = getData(tt_bill as any);
    expect(isHealthCert(data)).toBeFalsy();
  });
});

describe("test getHealthCertType() util function", () => {
  it("getHealthCertType() for v1 pdt should return pdt", () => {
    const data = getData(v1_pdt as any);
    expect(getHealthCertType(data)).toBe(HEALTHCERT_TYPE.PDT);
  });

  it("getHealthCertType() for v2 pdt should return pdt", () => {
    const data = getData(v2_pdt as any);
    expect(getHealthCertType(data)).toBe(HEALTHCERT_TYPE.PDT);
  });
  it("getHealthCertType() for vac cert should return pdt", () => {
    const data = getData(vac_cert as any);
    expect(getHealthCertType(data)).toBe(HEALTHCERT_TYPE.VAC);
  });
  it("getHealthCertType() for non health cert should return empty", () => {
    const data = getData(tt_bill as any);
    expect(getHealthCertType(data)).toBe("UNKNOWN");
  });
});

describe("sendHealthCertVerifiedEvent and sendHealthCertErrorEvent", () => {
  it("sendHealthCertVerifiedEvent should send document id and type", () => {
    const data = getData(v2_pdt as any);
    const spy = jest.spyOn(ReactGA, "event");
    sendHealthCertVerifiedEvent(data);
    expect(spy).toHaveBeenCalledWith(EVENT_CATEGORY.VERIFIED, {
      document_id: data.id,
      document_type: HEALTHCERT_TYPE.PDT,
    });
  });

  it("sendHealthCertErrorEvent should send document id, type and error message", async () => {
    const data = getData(invalid_vac_cert as any);
    const fragments = await verify(invalid_vac_cert as any);
    const spy = jest.spyOn(ReactGA, "event");
    sendHealthCertErrorEvent(data, fragments);
    const message: string = JSON.stringify(
      fragments.filter(({ status }) => status === "ERROR" || status === "INVALID")
    );
    expect(spy).toHaveBeenCalledWith(EVENT_CATEGORY.ERROR, {
      document_id: data.id,
      document_type: HEALTHCERT_TYPE.PDT,
      errors: message,
    });
  });
});
