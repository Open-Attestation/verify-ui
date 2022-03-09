import type { NextPage } from "next";

import Layout from "@components/layout/Layout";
import Heading from "@components/text/Heading";
import InternalButton from "@components/button/InternalButton";
import StepperTimeline from "@components/figure/Timeline";

const Section: React.FC<{ isBlue?: boolean }> = ({ children, isBlue = false }) => (
  <section className={["py-12", isBlue && "bg-background-blue"].filter(Boolean).join(" ")}>
    <div className="container flex flex-col md:flex-row items-center gap-10">{children}</div>
  </section>
);

const Home: NextPage = () => {
  return (
    <Layout>
      <Section>
        <div className="w-full md:w-2/5 md:pr-4">
          <Heading level="h1">An easy way to check and verify your certificates</Heading>
          <p className="my-5">
            We help you to verify the certificates you have of anyone from any government agencies. All in one place.
          </p>
          <InternalButton href="/verify">Verify</InternalButton>
        </div>
        <div className="w-3/4 mx-auto md:w-3/5 py-8 ">
          <img src="/images/main.svg" alt="Verify document" className="w-full max-w-xl md:ml-auto" draggable={false} />
        </div>
      </Section>
      <Section isBlue>
        <div className="w-full md:w-1/2 md:pr-4 md:order-2">
          <Heading level="h1">How we can help</Heading>
          <StepperTimeline
            items={[
              { title: "View", description: "Easy way to view your certificate" },
              { title: "Check", description: "Make sure it has not been tampered with" },
              { title: "Verify", description: "Find out if it is from a recognised institution" },
            ]}
          />
          <InternalButton href="/verify">Verify</InternalButton>
        </div>
        <div className="w-3/4 mx-auto md:w-1/2 py-8 md:order-1">
          <img src="/images/how-can-help.svg" alt="How we can help" className="w-full max-w-xl" draggable={false} />
        </div>
      </Section>
      <Section>
        <div className="w-full md:w-1/3 md:pr-4">
          <Heading level="h1">How it works</Heading>
          <p>
            {`When an official certificate is issued by the government, a unique digital code is tagged to it. This code,
            together with condensed information from the certificate, is stored on the blockchain.`}
          </p>
          <p>
            {`When you open the certificate on this site, its contents will be compared with what was stored on the
            blockchain.`}
          </p>
          <p>{`We'll check if the contents match and if the certificate comes from a recognised government body.`}</p>
          <p>{`This way, you'll know if the certificate is valid when you try to view it.`}</p>
          <InternalButton href="/verify">Verify</InternalButton>
        </div>
        <div className="w-3/4 mx-auto md:w-2/3 py-8">
          <img
            src="/images/how-it-works.svg"
            alt="How it works"
            className="w-full max-w-xl md:ml-auto"
            draggable={false}
          />
        </div>
      </Section>
    </Layout>
  );
};

export default Home;
