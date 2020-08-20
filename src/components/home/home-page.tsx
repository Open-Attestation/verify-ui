import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { ButtonPrimaryLink } from "../shared/button";
import { flexCenterColumn } from "../shared/mixin";
import { NavigationBar } from "../shared/navigation-bar";
import howCanHelpImage from "./images/how-can-help.svg";
import howItWorksImage from "./images/how-it-works.svg";
import mainImage from "./images/main.svg";

const Root = styled.div`
  section:nth-of-type(odd) {
    background-color: #fffdfa;
  }
  section:nth-of-type(even) {
    background-color: #faf9fb;
  }
`;

const Section = styled.section`
  ${flexCenterColumn()};
  min-height: 600px;
`;

const SectionImage = styled.img`
  width: 100%;
  max-width: 579px;
`;

const Progress = styled.div`
  .progress-step {
    position: relative;
    width: 100%;

    &:last-child:after {
      display: none;
    }

    &:before {
      display: flex;
      justify-content: center;
      align-items: center;
      content: "\f00c";
      font-family: "Font Awesome\ 5 Free";
      font-weight: 900;
      font-size: 12px;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      color: var(--accent-2);
      background: #fff;
      border: 4px solid var(--accent-2);
      margin-bottom: 20px;
    }

    &:after {
      content: "";
      position: absolute;
      top: 8px;
      left: 28px;
      height: 15px;
      background: var(--accent-2);
      width: 100%;
    }
  }
`;

export const HomePage: React.FunctionComponent = () => {
  return (
    <Root>
      <Section>
        <NavigationBar />
        <div className="container py-12 px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-1/2 md:px-4">
              <h1>An easy way to check and verify your certificates</h1>
              <p className="my-5">
                We help you to verify the certificates you have of anyone from any government agencies. All in one
                place.
              </p>
              <Link to="/verify">
                <ButtonPrimaryLink>Verify</ButtonPrimaryLink>
              </Link>
            </div>
            <div className="w-3/4 mx-auto md:w-1/2 py-6">
              <SectionImage src={mainImage} />
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container py-12 px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-1/2 md:px-4 md:order-2">
              <h1>How we can help</h1>
              <Progress className="mb-2">
                <div className="flex">
                  <div className="progress-step">
                    <h5 className="mb-1">View</h5>
                    <p>Easy way to view your certificate</p>
                  </div>
                  <div className="progress-step">
                    <h5 className="mb-1">Check</h5>
                    <p>Make sure it has not been tampered with</p>
                  </div>
                  <div className="progress-step">
                    <h5 className="mb-1">Verify</h5>
                    <p>Find out if it is from a recognised institution</p>
                  </div>
                </div>
              </Progress>
              <Link to="/verify">
                <ButtonPrimaryLink>Verify</ButtonPrimaryLink>
              </Link>
            </div>
            <div className="w-3/4 mx-auto md:w-1/2 py-6 md:order-1">
              <SectionImage src={howCanHelpImage} />
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container py-12 px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-1/2 md:px-4">
              <h1>How we can help</h1>
              <p>
                When an official certificate is issued by the government, a unique digital code is tagged to it. This
                code, together with condensed information from the certificate, is stored on the blockchain.
              </p>
              <p>
                When you open the certificate on this site, its contents will be compared with what was stored on the
                blockchain.
              </p>
              <p>We'll check if the contents match and if the certificate comes from a recognised government body.</p>
              <p>This way, you'll know if the certificate is valid when you try to view it.</p>
              <Link to="/verify">
                <ButtonPrimaryLink>Verify</ButtonPrimaryLink>
              </Link>
            </div>
            <div className="w-3/4 mx-auto md:w-1/2 py-6">
              <SectionImage src={howItWorksImage} />
            </div>
          </div>
        </div>
      </Section>
    </Root>
  );
};
