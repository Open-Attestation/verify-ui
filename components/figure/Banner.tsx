import Link from "next/link";

export const InformationBanner: React.FC = () => (
  <section className="py-4 bg-blue-50">
    <div className="container items-center gap-10">
      <p className="inline text-indigo-800 text-sm md:text-base space-x-1.5">
        <span className="font-normal">
          You can now scan the QR code on your .oa document via camera or barcode scanner 🎉
        </span>
        <Link href="/qr">
          <a
            className="text-indigo-800 underline visited:text-violet-300 font-bold"
            target="_blank"
            rel="noreferrer noopener"
          >
            Learn more.
          </a>
        </Link>
      </p>
    </div>
  </section>
);