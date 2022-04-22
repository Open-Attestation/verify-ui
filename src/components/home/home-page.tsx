import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { Banner } from "../banner/banner";
import { flexCenterColumn } from "../shared/mixin";
import { NavigationBar } from "../shared/navigation-bar";
import howCanHelpImage from "./images/how-can-help.svg";
import howItWorksImage from "./images/how-it-works.svg";
import mainImage from "./images/main.svg";

const Root = styled.div`
  section:nth-of-type(odd) {
    background-color: var(--yellow-light);
  }
  section:nth-of-type(even) {
    background-color: var(--purple-light);
  }
`;

const Section = styled.section`
  ${flexCenterColumn()};
  min-height: 600px;
`;

const SectionImage = styled.img`
  width: 100%;
  max-width: 580px;
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
      content: "\\f00c";
      font-family: "Font Awesome\ 5 Free";
      font-weight: 900;
      font-size: 12px;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      color: var(--teal);
      background: #fff;
      border: 4px solid var(--teal);
      margin-bottom: 20px;
    }

    &:after {
      content: "";
      position: absolute;
      top: 8px;
      left: 28px;
      height: 15px;
      background: var(--teal);
      width: 100%;
    }
  }
`;

export const HomePage: React.FunctionComponent = () => {
  return (
    <Root>
      <Section>
        <NavigationBar />
        <Banner /> {/* Comment this out once infura is backup */}
        <div className="container py-12">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-2/5 md:pr-4">
              <h1>An easy way to check and verify your certificates</h1>
              <p className="my-5">
                We help you to verify the certificates you have of anyone from any government agencies. All in one
                place.
              </p>
              <Link to="/verify">
                <button className="btn-solid-primary">Verify</button>
              </Link>
            </div>
            <div className="w-3/4 mx-auto md:w-3/5 py-8">
              <SectionImage alt="icon" src={mainImage} className="md:ml-auto" />
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container py-12">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-1/2 md:pr-4 md:order-2">
              <h1>How we can help</h1>
              <Progress className="mb-2">
                <div className="flex">
                  <div className="progress-step">
                    <div className="pr-5">
                      <div className="mb-1 text-xl font-bold">View</div>
                      <p>Easy way to view your certificate</p>
                    </div>
                  </div>
                  <div className="progress-step">
                    <div className="pr-5">
                      <div className="mb-1 text-xl font-bold">Check</div>
                      <p>Make sure it has not been tampered with</p>
                    </div>
                  </div>
                  <div className="progress-step">
                    <div className="pr-5">
                      <div className="mb-1 text-xl font-bold">Verify</div>
                      <p>Find out if it is from a recognised institution</p>
                    </div>
                  </div>
                </div>
              </Progress>
              <Link to="/verify">
                <button className="btn-solid-primary">Verify</button>
              </Link>
            </div>
            <div className="w-3/4 mx-auto md:w-1/2 py-8 md:order-1">
              <SectionImage alt="icon" src={howCanHelpImage} />
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container py-12">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-1/3 md:pr-4">
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
                <button className="btn-solid-primary">Verify</button>
              </Link>
            </div>
            <div className="w-3/4 mx-auto md:w-2/3 py-8">
              <SectionImage alt="icon" src={howItWorksImage} className="md:ml-auto" />
            </div>
          </div>
        </div>
      </Section>
    </Root>
  );
};
