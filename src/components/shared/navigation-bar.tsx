import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { Status } from "./../verify/verify-page";

const Logo = styled.div`
  color: var(--grey);
  font-family: "Libre Franklin", sans-serif;
  font-weight: 600;
  font-size: 36px;
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

interface NavigationBarProps {
  setVerificationStatus?: (status: number) => void;
}

export const NavigationBar: React.FunctionComponent<NavigationBarProps> = ({
  setVerificationStatus,
}: NavigationBarProps) => {
  return (
    <nav className="container mx-auto pt-4 px-4">
      <div className="flex flex-wrap items-center">
        <div className="w-auto mr-auto">
          <Logo>
            <Link to="/">Verify</Link>
          </Logo>
        </div>
        <div className="w-auto">
          <div className="flex items-center">
            <Link to="/faq">
              <FaqLink className="mr-8">FAQ</FaqLink>
            </Link>
            <Link
              to="/verify"
              onClick={() => {
                if (setVerificationStatus) {
                  setVerificationStatus(Status.IDLE);
                }
              }}
            >
              <ButtonLinkOutlined>Verify</ButtonLinkOutlined>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
