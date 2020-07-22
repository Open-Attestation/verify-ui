import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";

const Logo = styled.div`
  color: #434144;
  font-family: Libre Franklin;
  font-weight: 600;
  font-size: 36px;
  line-height: 44px;
`;

const FaqLink = styled.div`
  font-weight: 500;
  color: #434144;
`;

const ButtonLinkOutlined = styled.div`
  padding: 10px 20px;
  border: 2px solid var(--primary);
  box-sizing: border-box;
  border-radius: 15px;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: var(--primary);
`;

export const NavigationBar: React.FunctionComponent = () => (
  <nav className="flex justify-between pt-4">
    <Logo>
      <Link to="/">Verify</Link>
    </Logo>
    <div className="flex items-center">
      <Link to="/faq">
        <FaqLink className="mr-8">FAQ</FaqLink>
      </Link>
      <Link to="/verify">
        <ButtonLinkOutlined>Verify</ButtonLinkOutlined>
      </Link>
    </div>
  </nav>
);
