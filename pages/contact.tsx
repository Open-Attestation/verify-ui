import { NextPage } from "next";
import { NextSeo } from "next-seo";

import Layout from "@components/layout/Layout";

const Contactus: NextPage = () => {
  return (
    <Layout className="container py-12 min-h-[75vh] bg-[length:450px] bg-right-top bg-no-repeat md:bg-[url('/images/contact-us.svg')]">
      <NextSeo title="Contact us" />
      <h2>Contact us</h2>

      <div className="bg-white rounded-lg border-2 p-8 my-4 max-w-3xl">
        <p className="font-sans text-lg">
          Before contacting us, you might want to explore these commonly accessed pages:
          <ul className="list-disc list-outside pl-8">
            <li>
              <a
                href="https://faq.notarise.gov.sg/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-700"
              >
                Notαrise FAQs
              </a>
            </li>
            <li>
              <a
                href="https://www.openattestation.com/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-700"
              >
                OpenAttestation
              </a>
            </li>
          </ul>
        </p>
        <h2 className="font-sans text-2xl pt-6">Submit your query</h2>
        <p className="pt-2 text-lg font-sans">
          If your query is related to :
          <ul className="list-disc list-outside pl-8 text-lg">
            <li>
              Notαrise/HealthCerts or any other matters, please{" "}
              <a
                href="https://faq.notarise.gov.sg/hc/en-gb/requests/new"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-700"
              >
                contact us
              </a>
              .
            </li>
            <li>
              OpenAttestation, please contact us {" "}
              <a
                href="mailto:OpenAttestation_Support@tech.gov.sg"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-700 break-all"
              >
                here
              </a>
              .
            </li>
          </ul>
        </p>
      </div>
    </Layout>
  );
};

export default Contactus;
