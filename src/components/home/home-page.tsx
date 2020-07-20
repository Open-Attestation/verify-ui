import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
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
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 700px;
  & > * {
    max-width: 1280px;
    width: 1280px;
  }
`;

const SectionImage = styled.img`
  max-width: 579px;
`;

const Logo = styled.div`
  color: #434144;
  font-family: Libre Franklin;
  font-weight: 600;
  font-size: 36px;
  line-height: 44px;
`;

const FaqLink = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #434144;
`;

const ButtonLinkOutlined = styled.div`
  padding: 10px 20px;
  margin: 0px 10px;
  border: 2px solid var(--primary);
  box-sizing: border-box;
  border-radius: 15px;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: var(--primary);
`;

const ButtonLink = styled.div`
  display: inline-block;
  padding: 10px 20px;
  background: var(--primary);
  border-radius: 15px;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: #ffffff;
  margin-top: 5px;
`;

const MainSectionTitle = styled.div`
  font-family: Manjari;
  font-weight: 100;
  font-size: 54px;
  line-height: 58px;
`;

const SubSectionTitle = styled.div`
  font-size: 18px;
  line-height: 21px;
  color: #7a7a7a;
  margin: 20px 0;
`;

const Progress = styled.div`
  .progress-step {
    position: relative;
    width: 100%;
    margin-bottom: 10px;

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
      margin-bottom: 10px;
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

  .step-title {
    font-weight: bold;
    font-size: 20px;
    line-height: 23px;
    color: #7a7a7a;
  }
`;

export const HomePage: React.FunctionComponent = () => {
  return (
    <Root>
      <Section>
        <div className="flex justify-between pt-4">
          <Logo>Verify</Logo>
          <div className="flex items-center">
            <FaqLink>FAQ</FaqLink>
            <ButtonLinkOutlined className="">
              <Link to="/verify">Verify</Link>
            </ButtonLinkOutlined>
          </div>
        </div>
        <div className="flex items-center justify-center flex-grow">
          <div className="w-1/2">
            <MainSectionTitle>An easy way to check and verify your certificates</MainSectionTitle>
            <SubSectionTitle>
              We help you to verify the certificates you have of anyone from any government agencies. All in one place.
            </SubSectionTitle>
            <ButtonLink>
              <Link to="/verify">Verify</Link>
            </ButtonLink>
          </div>
          <div className="w-1/2">
            <SectionImage src={mainImage} />
          </div>
        </div>
      </Section>
      <Section>
        <div className="flex items-center justify-center flex-grow">
          <div className="w-1/2">
            <SectionImage src={howCanHelpImage} />
          </div>
          <div className="w-1/2">
            <MainSectionTitle>How we can help</MainSectionTitle>
            <Progress>
              <div className="flex">
                <div className="progress-step">
                  <div className="step-title">View</div>
                  <div>Easy way to view your certificate</div>
                </div>
                <div className="progress-step">
                  <div className="step-title">Check</div>
                  <div>Make sure it has not been tampered with</div>
                </div>
                <div className="progress-step">
                  <div className="step-title">Verify</div>
                  <div>Find out if it is from a recognised institution</div>
                </div>
              </div>
            </Progress>
            <ButtonLink>
              <Link to="/verify">Verify</Link>
            </ButtonLink>
          </div>
        </div>
      </Section>
      <Section>
        <div className="flex items-center justify-center flex-grow">
          <div className="w-1/2">
            <MainSectionTitle>How we can help</MainSectionTitle>
            <SubSectionTitle>
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
            </SubSectionTitle>
            <ButtonLink>
              <Link to="/verify">Verify</Link>
            </ButtonLink>
          </div>
          <div className="w-1/2">
            <SectionImage src={howItWorksImage} />
          </div>
        </div>
      </Section>
    </Root>
  );
};
