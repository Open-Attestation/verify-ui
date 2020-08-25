import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";

const Logo = styled.div`
  color: var(--grey);
  font-family: "Libre Franklin", sans-serif;
  font-weight: 600;
  font-size: 36px;
`;

export const NavigationBar: React.FunctionComponent = () => (
  <nav className="container mx-auto pt-4 px-4">
    <div className="flex flex-wrap items-center">
      <div className="w-auto mr-auto">
        <Logo>
          <Link to="/">verify.gov.sg</Link>
        </Logo>
      </div>
      <div className="w-auto">
        <div className="flex items-center">
          <Link to="/faq" className="text-grey font-bold mr-8">
            FAQ
          </Link>
          <Link to="/verify">
            <button className="btn-outline-primary">Verify</button>
          </Link>
        </div>
      </div>
    </div>
  </nav>
);
