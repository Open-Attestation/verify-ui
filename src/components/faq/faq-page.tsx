import styled from "@emotion/styled";
import React, { useState } from "react";
import arrowDownCircle from "../shared/images/arrow-down-circle.svg";
import { Section, Separator } from "../shared/layout";
import { NavigationBar } from "../shared/navigation-bar";
import mainFaqImage from "./images/main-faq.svg";

const Container = styled.div`
  background-repeat: no-repeat;
  background-position: top right;

  @media screen and (min-width: 768px) {
    background-image: url(${mainFaqImage});
  }
`;

const FaqTitleContainer = styled.div`
  min-height: 56px;
`;

const transitionDuration = "0.3s";

const FaqAnswer = styled.div`
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
    <div className={`transition-color duration-200 cursor-pointer bg-white ${open ? "" : "hover:text-primary"}`}>
      <FaqTitleContainer
        className={`flex justify-between items-center p-4 ${open ? "" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <h5>{question}</h5>
        <ArrowImage src={arrowDownCircle} alt="Press to toggle answer" className={open ? "rotation90" : "rotation0"} />
      </FaqTitleContainer>
      <FaqAnswer className={`bg-white mb-2 px-4 ${open ? "open" : "close"}`}>
        <p>{answer}</p>
      </FaqAnswer>
    </div>
  );
};

export const FaqPage: React.FunctionComponent = () => (
  <Section>
    <NavigationBar />
    <Separator />
    <div className="container container-px py-4">
      <div className="flex flex-wrap">
        <div className="w-auto">
          <h2>Questions? Look here.</h2>
        </div>
      </div>
    </div>
    <Container className="mb-8">
      <div className="container container-px">
        <div className="flex flex-wrap">
          <div className="w-full md:w-2/3">
            <FaqElement
              question="What documents can I verify on verify.gov.sg?"
              answer="You can verify documents that have been issued by Singapore government entities with a .oa file on verify.gov.sg."
            />
            <FaqElement
              question="Who developed verify.gov.sg?"
              answer="GovTech Singapore developed verify.gov.sg backed by blockchain technology."
            />
            <FaqElement
              question="Can i verify educational or training certificates on verify.gov.sg?"
              answer="For educational and training certificates, please visit opencerts.io instead."
            />
            <FaqElement
              question="Why is verify.gov.sg backed by blockchain technology?"
              answer="Using blockchain, we can greatly reduce the barrier of entry to publishing protected documents in a secure format, instead of using existing proprietary software that is costly. In addition, a public blockchain is owned and maintained by the community and is easily accessible by anyone. As a result, there is no need to run or maintain services to verify documents."
            />
            <FaqElement
              question="Why can't I print the verified document or .oa file?"
              answer="Printing the verified document discards all the advanced protections we have built to preserve the .oa file in a secure format. Printed documents cannot be verified."
            />
            <FaqElement
              question="What happens if I modify the verified document or .oa file?"
              answer="A verified document that has been modified will show up as having been tampered with."
            />
            <FaqElement
              question="Is my personal data safe on the blockchain?"
              answer="Document contents and personal data are not published on the blockchain. A hash (a unique digital code) is generated from the document and is used to prove that the document is legitimate. Since the hash is the only information published into the blockchain, no personal information can be obtained from content on the blockchain."
            />
            <FaqElement
              question="What is a hash?"
              answer="In every properly issued .oa file, there is a hash which is a unique digital code to verify that the contents of the document have not been altered."
            />
            <FaqElement
              question="Why use the Ethereum blockchain?"
              answer="The Ethereum Blockchain is a publicly usable distributed ledger based on blockchain technology. You can think of it as a publicly readable database. Ethereum is the blockchain network with the largest developer base, as well as having a large number of participants securing the network."
            />
            <FaqElement
              question="What does it mean when a document is Revoked?"
              answer="It means that the issuer has officially cancelled the document such that the document is no longer valid."
            />
          </div>
        </div>
      </div>
    </Container>
  </Section>
);
