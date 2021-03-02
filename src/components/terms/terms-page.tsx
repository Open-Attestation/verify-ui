import React from "react";
import { Section, Separator } from "../shared/layout";
import { NavigationBar } from "../shared/navigation-bar";
import { generateTOU } from "./generate-tou";
import tou from "./tou.json";

export const TermsPage: React.FC = () => {
  const touDoc = tou as Record<string, string[]>;

  return (
    <Section>
      <NavigationBar />
      <Separator />

      <div className="container px-4 my-3">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-2/3">{generateTOU(touDoc)}</div>
        </div>
      </div>
    </Section>
  );
};
