import type { NextPage } from "next";

import Layout from "@components/layout/Layout";
import Heading from "@components/text/Heading";
import InternalButton from "@components/button/InternalButton";
import StepperTimeline from "@components/feature/timeline";

const Section: React.FC<{ isBlue?: boolean }> = ({ children, isBlue = false }) => (
  <section className={["py-20", isBlue && "bg-background-blue"].filter(Boolean).join(" ")}>
    <div className="container flex flex-col md:flex-row items-center gap-10">{children}</div>
  </section>
);

const Home: NextPage = () => {
  return (
    <Layout>
      <Section>
        <div className="max-w-xl flex flex-col items-start gap-5">
          <Heading level="h1">An easy way to check and verify your certificates</Heading>
          <p>
            We help you to verify the certificates you have of anyone from any government agencies. All in one place.
          </p>
          <InternalButton href="/verify">Verify</InternalButton>
        </div>
        <div className="flex-auto max-w-lg">
          <img src="/images/main.svg" className="w-full h-auto" draggable={false} />
        </div>
      </Section>
      <Section isBlue>
        <div className="max-w-xl lg:order-2 flex flex-col items-start gap-5">
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
        <div className="flex-auto max-w-lg lg:order-1">
          <img src="/images/how-can-help.svg" className="w-full h-auto" draggable={false} />
        </div>
      </Section>
      <Section>
        <div className="max-w-xl flex flex-col items-start gap-5">
          <Heading level="h1">How we can help</Heading>
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
        <div className="flex-auto max-w-lg">
          <img src="/images/how-it-works.svg" className="w-full h-auto" draggable={false} />
        </div>
      </Section>
    </Layout>
  );
};

export default Home;
