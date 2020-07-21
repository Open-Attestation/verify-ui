import styled from "@emotion/styled";
import React from "react";
import govtechLogo from "./images/logo_govtech_hort.gif";

const BroughtToYou = styled.div`
  color: #6f6d71;
`;
const Copyright = styled.div`
  font-size: 13px;
  line-height: 15px;
`;
const GovtechImage = styled.img`
  width: 197px;
`;
const VulnerabilityLink = styled.a`
  font-size: 13px;
  line-height: 15px;
  color: var(--primary);
`;

export const Footer: React.FunctionComponent = () => (
  <footer className="flex flex-col items-center m-5">
    <BroughtToYou className="font-bold">Verify.gov is brought to you by Government Technology Agency:</BroughtToYou>
    <div>
      <GovtechImage className="mb-3" src={govtechLogo} alt="govtech logo" />
    </div>
    <Copyright>©2020 Government of Singapore | Last updated 23rd May 2020</Copyright>
    <div>
      <VulnerabilityLink href="https://www.tech.gov.sg/report_vulnerability" target="_blank" rel="noopener noreferrer">
        Report Vulnerability
      </VulnerabilityLink>
    </div>
  </footer>
);
