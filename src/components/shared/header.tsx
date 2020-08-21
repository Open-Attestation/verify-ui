import styled from "@emotion/styled";
import React from "react";

// Extracted styles from here (sgds-govtech@1.3.14/css/sgds.css)
// https://github.com/GovTechSG/sgds/blob/master/sgds/sass/sgds-components/_sgds-masthead.scss
const SgdsMastHead = styled.header`
  position: relative;
  background-color: #f0f0f0;
  height: auto;
  padding: 4px 0;
  font-size: 14px;

  @media screen and (max-width: 1024px - 1px) {
    padding-left: 4px;
    padding-right: 4px;
  }

  .is-text {
    margin-left: 4px;
  }

  .sgds-icon {
    font-size: 20px;
  }

  a {
    color: #484848;
    display: flex;
    align-items: center;

    &:hover {
      color: #151515;
    }
  }
`;

// https://github.com/GovTechSG/sgds/blob/master/sgds/sass/sgds-icons/_sgds-icon-style.scss
const SgdsIcon = styled.span`
  font-family: "sgds-icons" !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  font-size: 20px;

  &.sgds-icon-sg-crest {
    &::before {
      content: "\\e948";
      color: #db0000;
    }
  }
`;

export const Header: React.FunctionComponent = () => (
  <SgdsMastHead>
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap">
        <div className="w-full">
          <a href="https://www.gov.sg" target="_blank" rel="noopener noreferrer">
            <SgdsIcon className="sgds-icon-sg-crest" />
            <span className="is-text">A Singapore Government Agency Website</span>
          </a>
        </div>
      </div>
    </div>
  </SgdsMastHead>
);
