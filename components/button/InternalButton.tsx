import React from "react";
import Link, { LinkProps } from "next/link";

const buttonClass = `font-bold py-2 px-4
text-white bg-primary hover:bg-primary-dark
rounded-xl focus:ring
transition-colors`;

const invertedButtonClass = `font-bold py-2 px-4
text-primary hover:text-white hover:bg-primary
rounded-xl border-2 border-primary focus:ring
transition-colors`;

interface InternalButtonProps extends React.PropsWithChildren<LinkProps> {
  isInverted?: boolean;
}

const InternalButton: React.FC<InternalButtonProps> = ({ children, isInverted = false, ...rest }) => (
  <Link {...rest}>
    <a className={isInverted ? invertedButtonClass : buttonClass}>{children}</a>
  </Link>
);

export default InternalButton;
