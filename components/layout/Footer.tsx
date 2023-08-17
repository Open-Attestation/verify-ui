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
      <section className="container py-12">
        <p className="text-2xl text-gray-600 font-roboto-bold">Verify</p>
        <p className="text-gray-600/80 max-w-xl mt-1">
          Verify provides an easy way to check the validity of digital documents with an .oa extension, that have been
          issued by Singapore government entities.
        </p>
        <div className="flex flex-col sm:flex-row gap-y-2 gap-x-8 text-base mt-4 mb-12 font-medium">
          <Link href="/">
            <a className="text-primary hover:text-blue-600">Verify</a>
          </Link>
          <Link href="/qr">
            <a className="text-primary hover:text-blue-600">Scan QR</a>
          </Link>
          <Link href="/verify">
            <a className="text-primary hover:text-blue-600">Verify via OA file</a>
          </Link>
          {/* <a className="text-gray-500 hover:text-gray-600" href="mailto:OpenAttestation_Support@tech.gov.sg">
            Contact Us
          </a> */}
        </div>
        <div className="flex flex-col justify-end sm:flex-row gap-y-2 gap-x-8 text-base mt-8 font-medium">
          <Link href="/contact">
            <a className="text-primary hover:text-blue-600">Contact Us</a>
          </Link>
          <Link href="/faq">
            <a className="text-primary hover:text-blue-600">FAQ</a>
          </Link>
        </div>
        <div className="pt-4">
          <div className="flex sm:flex-row flex-col gap-y-2 gap-x-8 text-sm font-medium">
            <a
              href="https://www.tech.gov.sg/report_vulnerability"
              target="_blank"
              rel="noreferrer noopener"
              className="text-base text-primary hover:text-blue-600"
            >
              Report Vulnerability
            </a>
            <Link href="/privacy-policy">
              <a className="text-base text-primary hover:text-blue-600">Privacy Statement</a>
            </Link>
            <Link href="/terms">
              <a className="text-base text-primary hover:text-blue-600">Terms of Use</a>
            </Link>
          </div>

          <div className="flex text-gray-600 flex-col flex-wrap mt-4 mb-0 items-end text-right">
            <p className="text-sm my-0">© {year} Government Technology Agency</p>
            <p className="text-sm my-0">Last Updated {buildDate}</p>
            <p className="text-xs mt-4 mb-0">Version: {COMMIT_REF}</p>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
