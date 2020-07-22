import styled from "@emotion/styled";
import React, { useState } from "react";
import arrowDownCircle from "../shared/images/arrow-down-circle.svg";
import { Section, Separator, Title } from "../shared/layout";
import { NavigationBar } from "../shared/navigation-bar";
import mainFaqImage from "./images/main-faq.svg";

const Container = styled.div`
  background-image: url(${mainFaqImage});
  background-repeat: no-repeat;
  background-position: top right;
`;

const FaqContainer = styled.div`
  & > * {
    margin: 10px 0;
  }
`;

const FaqTitleContainer = styled.div`
  height: 56px;
  background: #ffffff;
  border-color: #eeecf1;
`;
const FaqTitle = styled.span`
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: #434144;
`;

const transitionDuration = "0.3s";
const FaqAnswer = styled.div`
  background: #ffffff;
  padding: 10px 2rem;
  overflow: hidden;
  transition: max-height ${transitionDuration} ease-out;
  height: auto;
  max-height: 250px;

  &.close {
    max-height: 0;
    padding: 0;
    transition: padding ${transitionDuration} step-end, max-height ${transitionDuration} ease-out;
  }
`;

const ArrowImage = styled.img`
  &.rotation90 {
    transform: rotate(90deg);
    transition: transform ${transitionDuration} ease-out;
  }
  &.rotation0 {
    transform: rotate(0deg);
    transition: transform ${transitionDuration} ease-in;
  }
`;

const FaqElement: React.FunctionComponent<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <FaqTitleContainer
        className={`flex justify-between items-center px-8 cursor-pointer ${open ? "border-b" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <FaqTitle>{question}</FaqTitle>
        <ArrowImage src={arrowDownCircle} alt="Press to toggle answer" className={open ? "rotation90" : "rotation0"} />
      </FaqTitleContainer>
      <FaqAnswer className={open ? "open" : "close"}>{answer}</FaqAnswer>
    </div>
  );
};

export const FaqPage: React.FunctionComponent = () => (
  <Section>
    <NavigationBar />
    <Separator />
    <Title>Questions? Look here.</Title>
    <Container className="mb-8">
      <FaqContainer className="w-2/3">
        <FaqElement
          question="Who developed Verify.gov?"
          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
        <FaqElement
          question="What is Verify.gov?"
          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
        <FaqElement
          question="Why is Verify.gov backed by blockchain technology?"
          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
        <FaqElement
          question="Why can’t I print the certificate?"
          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
        <FaqElement
          question="Who developed Verify.gov?"
          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
        <FaqElement
          question="What is Verify.gov?"
          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
        <FaqElement
          question="Who developed OpenCerts?"
          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
        <FaqElement
          question="What is OpenCerts?"
          answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
      </FaqContainer>
    </Container>
  </Section>
);
