import styled from "@emotion/styled";
import React from "react";
import govtechLogo from "./images/logo_govtech_hort.gif";

const GovtechImage = styled.img`
  width: 197px;
`;

export const Footer: React.FunctionComponent = () => (
  <footer className="flex flex-col items-center m-5">
    <h6>Verify.gov is brought to you by Government Technology Agency:</h6>
    <GovtechImage className="mb-4" src={govtechLogo} alt="govtech logo" />
    <p className="small">©2020 Government of Singapore | Last updated 23rd May 2020</p>
    <p className="small">
      <a
        className="text-primary"
        href="https://www.tech.gov.sg/report_vulnerability"
        target="_blank"
        rel="noopener noreferrer"
      >
        Report Vulnerability
      </a>
    </p>
  </footer>
);
