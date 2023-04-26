import Link from "next/link";

import InternalButton from "@components/button/InternalButton";

const NavigationBar: React.FC = () => (
  <nav className="bg-white border-b border-gray-200">
    <div className="flex flex-wrap gap-4 items-center justify-between container py-4">
      <Link href="/">
        <a className="font-bold text-4xl">Verify</a>
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/faq">
          <a className="font-bold py-2 rounded-xl">FAQ</a>
        </Link>
        <Link href="/qr">
          <a className="font-bold py-2 px-4 rounded-xl">Scan QR</a>
        </Link>
        <InternalButton href="/verify" isInverted>
          Verify
        </InternalButton>
      </div>
    </div>
  </nav>
);

export default NavigationBar;
