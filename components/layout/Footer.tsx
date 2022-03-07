import Link from "next/link";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white">
      <div className="h-px w-full bg-gray-200" />
      <section className="container pt-12 pb-8">
        <h3 className="text-3xl text-gray-600 font-roboto-bold">Verify</h3>
        <p className="text-gray-600 opacity-60 max-w-xl mt-1">
          Verify provides an easy way to check the validity of digital documents with an .oa extension, that have been
          issued by Singapore government entities.
        </p>
        <div className="text-base mt-8 font-bold">
          <Link href="/">
            <a className="mr-8 xs:inline-block block text-gray-500 hover:text-gray-600 font-bold">Verify</a>
          </Link>
          <Link href="/faq">
            <a className="mr-8 xs:inline-block block text-gray-500 hover:text-gray-600">FAQs</a>
          </Link>
          <a
            className="mr-8 xs:inline-block block text-gray-500 hover:text-gray-600"
            href="OpenAttestation_Support@tech.gov.sg"
          >
            Contact Us
          </a>
        </div>
        <div className="w-full block mt-12">
          <p className="text-gray-600 text-xs w-full opacity-60">A collaboration between</p>
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
        <div className="text-sm font-bold">
          <a
            href="https://www.tech.gov.sg/report_vulnerability"
            target="_blank"
            rel="noreferrer noopener"
            className="mr-10 xs:inline-block block text-gray-500 hover:text-gray-600"
          >
            Report Vulnerability
          </a>
          <Link href="/privacy-policy">
            <a className="mr-10 xs:inline-block block text-gray-500 hover:text-gray-600">Privacy Statement</a>
          </Link>
          <Link href="/terms-of-use">
            <a className="mr-10 xs:inline-block block  text-gray-500 hover:text-gray-600">Terms of Use</a>
          </Link>
        </div>
        <div className="mt-4 flex justify-between items-end flex-wrap">
          <div className="flex">
            <a href="https://hive.tech.gov.sg" target="_blank" rel="noopener noreferrer" className="flex-none">
              <img src="/images/hive.png" width="96" height="40" alt="Government Digital Services" />
            </a>
            <p className="text-xs text-gray-600 opacity-60 ml-6">
              Developed by Government Digital Services <br />A Division of Government Technology Agency Singapore
            </p>
          </div>
          <div className="flex text-gray-600 text-xs flex-wrap mt-4 justify-items-end opacity-60">
            <p className="mr-8">Version {process.env.VERSION}</p>
            <p>© {year} Government Technology Agency</p>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
