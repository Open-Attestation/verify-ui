import React from "react";

interface VerifierProps extends React.HTMLAttributes<HTMLHeadingElement> {
  url?: string;
}

const Verifier: React.FC<VerifierProps> = ({ children, ...rest }) => {
  return null;
};

export default Verifier;
