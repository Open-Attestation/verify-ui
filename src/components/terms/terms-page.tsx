import React from "react";
import { Section, Separator } from "../shared/layout";
import { NavigationBar } from "../shared/navigation-bar";
import { serviceDoc } from "./docs/service-description-doc";
import { tou } from "./docs/tou-doc";
import { GenerateDoc } from "./generate-doc";

export const TermsPage: React.FC = () => {
  return (
    <Section>
      <NavigationBar />
      <Separator />

      <div className="container px-4 my-3">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-2/3">
            <h2 className="w-auto">Terms of Use</h2>
            {GenerateDoc(tou as Record<string, string[] | JSX.Element[]>)}
            <p className="text-center">This version of the Terms of Use is dated 20 August 2018.</p>
            <hr />
            <h2 className="w-auto">Schedule</h2>
            {GenerateDoc(serviceDoc as Record<string, string[] | JSX.Element[]>)}
          </div>
        </div>
      </div>
    </Section>
  );
};
