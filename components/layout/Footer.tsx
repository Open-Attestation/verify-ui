import Link from "next/link";

const COMMIT_REF = process.env.COMMIT_REF?.substring(0, 6) || "v1.0.0"; // See "next.config.js"
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString(); // See "next.config.js"

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const buildDate = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(BUILD_DATE)
  );
  return (
    <footer className="bg-white">
      <div className="h-px w-full bg-gray-200" />
      <section className="container pt-12 pb-8">
        <p className="text-3xl text-gray-600 font-roboto-bold">Verify</p>
        <p className="text-gray-600/80 max-w-xl mt-1">
          Verify provides an easy way to check the validity of digital documents with an .oa extension, that have been
          issued by Singapore government entities.
        </p>
        <div className="flex flex-col xs:flex-row gap-y-4 gap-x-8 text-base mt-8 font-bold">
          <Link href="/">
            <a className="text-gray-500 hover:text-gray-600 font-bold">Verify</a>
          </Link>
          <Link href="/faq">
            <a className="text-gray-500 hover:text-gray-600">FAQs</a>
          </Link>
          <Link href="/contact">
            <a className="text-gray-500 hover:text-gray-600">Contact Us</a>
          </Link>
          {/* <a className="text-gray-500 hover:text-gray-600" href="mailto:OpenAttestation_Support@tech.gov.sg">
            Contact Us
          </a> */}
        </div>
        <div className="w-full block mt-12">
          <p className="text-gray-600 text-xs w-full">A collaboration between</p>
          <div className="">
            <a href="https://www.tech.gov.sg" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/govtechlogo.png"
                width="136"
                height="49"
                className="mt-4 mr-12 inline-block"
                alt="Brought to you by Government Technology Agency"
              />
            </a>
            <a href="https://www.smartnation.gov.sg" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/sndgo.png"
                width="136"
                height="34"
                className="sm:mt-4 mt-8 inline-block"
                alt="Brought to you by Smart Nation and Digital Government Office"
              />
            </a>
          </div>
        </div>
      </section>
      <div className="h-px w-full bg-gray-100" />
      <section className="container py-6">
        <div className="flex sm:flex-row flex-col gap-y-4 gap-x-8 text-sm font-bold">
          <a
            href="https://www.tech.gov.sg/report_vulnerability"
            target="_blank"
            rel="noreferrer noopener"
            className="text-gray-500 hover:text-gray-600"
          >
            Report Vulnerability
          </a>
          <Link href="/privacy-policy">
            <a className="text-gray-500 hover:text-gray-600">Privacy Statement</a>
          </Link>
          <Link href="/terms">
            <a className="text-gray-500 hover:text-gray-600">Terms of Use</a>
          </Link>
        </div>
        <div className="mt-8 flex justify-between items-end flex-wrap">
          <div className="flex gap-4">
            <a href="https://hive.tech.gov.sg" target="_blank" rel="noopener noreferrer" className="flex-none">
              <img src="/images/hive.png" width="96" height="40" alt="Government Digital Services" />
            </a>
            <p className="text-xs text-gray-600/80">
              Developed by Government Digital Services
              <br />A Division of Government Technology Agency Singapore
            </p>
          </div>
          <div className="flex text-gray-600 flex-wrap mt-4 justify-items-end">
            <p className="mr-8 text-xs">
              Version: {COMMIT_REF} | {buildDate}
            </p>
            <p className="text-xs">© {year} Government Technology Agency</p>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
