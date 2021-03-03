import React from "react";
import { Section, Separator } from "../shared/layout";
import { NavigationBar } from "../shared/navigation-bar";
import { TermsOfUse } from "./generate-tou";
import tou from "./tou.json";

export const TermsPage: React.FC = () => {
  const touDoc = tou as Record<string, string[]>;

  return (
    <Section>
      <NavigationBar />
      <Separator />

      <div className="container px-4 my-3">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-2/3">   
            {TermsOfUse(touDoc)}
            <p className="text-center">This version of the Terms of Use is dated 20 August 2018.</p>
            </div>
        </div>
      </div>
    </Section>
  );
};
