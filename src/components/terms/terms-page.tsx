// import styled from "@emotion/styled";
import React from "react";
import { Section, Separator } from "../shared/layout";
import { NavigationBar } from "../shared/navigation-bar";

export const TermsPage: React.FunctionComponent = () => (
  <Section>
    <NavigationBar />
    <Separator />
    <div className="container px-4 my-3">
      <div className="flex flex-wrap">
        <div className="w-auto">
          <h2>Terms of Use.</h2>
        </div>
      </div>
    </div>
    <div className="container px-4 py-3">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-2/3">
          <h4 className="text-primary mb-2">General</h4>
          <p>
            Welcome to Verify.gov provided by the Government Technology Agency (“GovTech”). These Terms of Use (“Terms”)
            govern your use of Verify.gov. Please read these Terms carefully as any non-compliance may result in civil
            or criminal liability.
          </p>
          <p>
            By accessing and using any part of Verify.gov, you agree to be bound by these Terms. You may access and use
            Verify.gov in the manner permitted under these Terms. If you do not agree to these Terms, please do not use
            Verify.gov.
          </p>
        </div>
      </div>
    </div>
    <div className="container px-4 py-3">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-2/3">
          <h4 className="text-primary mb-2">Use of Verify.gov</h4>
          <p>You agree that you will not, directly or indirectly —</p>
          <ol className="list-decimal">
            <li>
              <p>
                modify, reverse-engineer, decompile, adapt, publish, redistribute or interfere with or intercept any
                transaction which is part of Verify.gov;
              </p>
            </li>
            <li>
              <p>
                use Verify.gov for any commercial purpose or for the benefit of any third party (save where authorised
                by GovTech), including renting, selling, leasing or directly or indirectly charging others for the use
                of Verify.gov;
              </p>
            </li>
            <li>
              <p>remove, circumvent, impair, bypass, disable or otherwise interfere with any feature of Verify.gov;</p>
            </li>
            <li>
              <p>access, submit or use any data which you are not validly authorised to access, submit or use;</p>
            </li>
            <li>
              <p>misrepresent or make false or misleading claims regarding Verify.gov;</p>
            </li>
            <li>
              <p>
                use Verify.gov for any illegal activity, unlawful purpose, or purposes prohibited by these Terms or in
                breach of these Terms;
              </p>
            </li>
            <li>
              <p>
                use any device, software, exploits, or routine, including any virus, Trojan horse, worm, time bomb,
                robot, spider, data-mining or data scraping tool or cancel bot intended to damage or interfere with the
                proper operation of Verify.gov or to intercept or expropriate any data from Verify.gov;
              </p>
            </li>
            <li>
              <p>
                use Verify.gov in any manner that could damage, disrupt, disable, overburden, or impair the operation of
                Verify.gov or interfere with any person’s use of Verify.gov;
              </p>
              <ol className="list-decimal">
                <li>
                  <p>while using Verify.gov, upload, post or transmit any material of any type that —</p>
                </li>
                <li>
                  <p>is contrary to any law, statute or subsidiary legislation;</p>
                </li>
                <li>
                  <p>is false, offensive, defamatory, inaccurate, misleading or fraudulent; or</p>
                </li>
                <li>
                  <p>infringes or violates the rights of any person;</p>
                </li>
              </ol>
            </li>
            <li>
              <p>use Verify.gov to access data not intended for you.</p>
            </li>
          </ol>
          <p>
            You agree to comply with any and all guidelines, notices, operating rules and policies and instructions
            pertaining to the use of Verify.gov, including any amendments to the foregoing, issued by GovTech from time
            to time, as well as any applicable laws and regulations.
          </p>
        </div>
      </div>
    </div>
  </Section>
);
