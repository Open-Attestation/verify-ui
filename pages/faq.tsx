import { NextPage } from "next";
import { NextSeo } from "next-seo";

import Layout from "@components/layout/Layout";
import Accordion from "@components/figure/Accordion";

interface FAQ {
  question: string;
  answer: string;
}

const FAQ: NextPage = () => {
  return (
    <Layout className="container py-12 min-h-[75vh] bg-[length:450px] bg-right-top bg-no-repeat md:bg-[url('/images/main-faq.svg')]">
      <NextSeo title="FAQ" />
      <h2>Questions? Look here.</h2>
      <div className="grid gap-2 my-5 md:max-w-4xl">
        {faqs.map((faq, i) => (
          <Accordion key={i} title={faq.question} content={faq.answer} />
        ))}
      </div>
    </Layout>
  );
};

export default FAQ;

const faqs: FAQ[] = [
  {
    question: "What documents can I verify on verify.gov.sg?",
    answer:
      "You can verify documents that have been issued by Singapore government entities with a .oa file on verify.gov.sg.",
  },
  {
    question: "Who developed verify.gov.sg?",
    answer: "GovTech Singapore developed verify.gov.sg backed by blockchain technology.",
  },
  {
    question: "Can I verify educational or training certificates on verify.gov.sg?",
    answer: "For educational and training certificates, please visit opencerts.io instead.",
  },
  {
    question: "Why is verify.gov.sg backed by blockchain technology?",
    answer:
      "Using blockchain, we can greatly reduce the barrier of entry to publishing protected documents in a secure format, instead of using existing proprietary software that is costly. In addition, a public blockchain is owned and maintained by the community and is easily accessible by anyone. As a result, there is no need to run or maintain services to verify documents.",
  },
  {
    question: "Why can't I print the verified document or .oa file?",
    answer:
      "Printing the verified document discards all the advanced protections we have built to preserve the .oa file in a secure format. Printed documents cannot be verified.",
  },
  {
    question: "What happens if I modify the verified document or .oa file?",
    answer: "A verified document that has been modified will show up as having been tampered with.",
  },
  {
    question: "Is my personal data safe on the blockchain?",
    answer:
      "Document contents and personal data are not published on the blockchain. A hash (a unique digital code) is generated from the document and is used to prove that the document is legitimate. Since the hash is the only information published into the blockchain, no personal information can be obtained from content on the blockchain.",
  },
  {
    question: "What is a hash?",
    answer:
      "In every properly issued .oa file, there is a hash which is a unique digital code to verify that the contents of the document have not been altered.",
  },
  {
    question: "Why use the Ethereum blockchain?",
    answer:
      "The Ethereum Blockchain is a publicly usable distributed ledger based on blockchain technology. You can think of it as a publicly readable database. Ethereum is the blockchain network with the largest developer base, as well as having a large number of participants securing the network.",
  },
  {
    question: "What does it mean when a document is Revoked?",
    answer: "It means that the issuer has officially cancelled the document such that the document is no longer valid.",
  },
];
