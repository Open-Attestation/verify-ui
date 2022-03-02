import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const headingToSize = (level: HeadingProps["level"]) => {
  switch (level) {
    case "h1":
      return "text-4xl md:text-5xl";
    case "h2":
      return "text-3xl md:text-4xl";
    default:
      return "text-2xl md:text-3xl";
  }
};

const Heading: React.FC<HeadingProps> = ({ level, children, ...rest }) => {
  return React.createElement(level, { className: `font-heading ${headingToSize(level)}`, ...rest }, children);
};

export default Heading;
