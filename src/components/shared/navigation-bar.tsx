import React from "react";
import { Link } from "react-router-dom";

interface NavigationBarProps {
  onVerifyLinkClicked?: () => void;
}

export const NavigationBar: React.FunctionComponent<NavigationBarProps> = ({
  onVerifyLinkClicked,
}: NavigationBarProps) => {
  return (
    <nav className="container container-px mx-auto pt-4">
      <div className="flex flex-wrap items-center">
        <div className="w-auto mr-auto">
          <Link to="/" className="font-roboto-bold text-4xl">
            Verify
          </Link>
        </div>
        <div className="w-auto">
          <div className="flex items-center">
            <Link to="/faq" className="text-grey font-bold mr-8">
              FAQ
            </Link>
            <Link to="/verify" onClick={onVerifyLinkClicked}>
              <button className="btn-outline-primary">Verify</button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
