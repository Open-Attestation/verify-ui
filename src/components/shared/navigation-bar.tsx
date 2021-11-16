import Link from "next/link";

interface NavigationBarProps {
  onVerifyLinkClicked?: () => void;
}

export const NavigationBar: React.FunctionComponent<NavigationBarProps> = ({
  onVerifyLinkClicked,
}: NavigationBarProps) => {
  return (
    <nav className="container pt-4">
      <div className="flex flex-wrap items-center">
        <div className="w-auto mr-auto">
          <Link href="/">
            <a className="font-roboto-bold text-4xl">Verify</a>
          </Link>
        </div>
        <div className="w-auto">
          <div className="flex items-center">
            <Link href="/faq">
              <a className="text-grey font-bold mr-8">FAQ</a>
            </Link>
            <Link href="/verify" passHref>
              <button className="btn-outline-primary" onClick={onVerifyLinkClicked}>
                Verify
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
