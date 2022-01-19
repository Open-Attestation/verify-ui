import styled from "@emotion/styled";
import preval from "preval.macro";
import React from "react";
import { Link } from "react-router-dom";
import govtechLogo from "./images/govtech-logo.svg";
import gdsLogo from "./images/logo-colored-dark-on-light.svg";

const GovtechLogoImage = styled.img`
  width: 160px;
`;

const GdsLogoImage = styled.img`
  width: 200px;
`;

export const LastUpdated: React.FunctionComponent = () => {
  // https://github.com/facebook/create-react-app/issues/4960
  const year = preval`module.exports = new Date().getFullYear();`;
  const buildDate = preval`module.exports = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long", day: "numeric" }).format(new Date());`;

  return (
    <>
      <p className="small">
        ©{year} Government Technology Agency | Last updated {buildDate}
      </p>
      <p className="small">v1.0.0-{process.env.REACT_APP_COMMIT_REF?.substring(0, 6)}</p>
    </>
  );
};

export const Footer: React.FunctionComponent = () => (
  <footer className="container mx-auto max-w-lg items-center text-center py-6">
    <div className="text-md font-bold">verify.gov.sg is brought to you by Government Technology Agency:</div>
    <div className="flex flex-wrap items-center justify-center my-6">
      <div className="w-full sm:w-auto">
        <a
          className="inline-block transition-opacity hover:opacity-75"
          href="https://www.tech.gov.sg/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GovtechLogoImage src={govtechLogo} alt="GovTech logo" />
        </a>
      </div>
      <div className="w-full sm:w-auto">
        <a
          className="inline-block transition-opacity hover:opacity-75"
          href="https://hive.tech.gov.sg/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GdsLogoImage src={gdsLogo} alt="Government Digital Services logo" />
        </a>
      </div>
    </div>
    <LastUpdated />
    <p className="small">
      <Link to="/terms" className="text-primary mx-3">
        Terms of use
      </Link>
      <Link to="/privacy-policy" className="text-primary mx-3">
        Privacy policy
      </Link>
      <a
        className="text-primary mx-3"
        href="https://www.tech.gov.sg/report_vulnerability"
        target="_blank"
        rel="noopener noreferrer"
      >
        Report Vulnerability
      </a>
    </p>
  </footer>
);
