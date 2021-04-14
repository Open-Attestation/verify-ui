import styled from "@emotion/styled";
import React, { ButtonHTMLAttributes, FunctionComponent } from "react";

const InnerButtonIcon = styled.button`
  width: 40px;
  height: 40px;
  svg {
    max-width: 20px;
    margin-left: auto;
    margin-right: auto;
  }

  @media print {
    display: inline-block;
    background-color: #4e73b6; // primary
    box-shadow: 0 4px 6px 3px rgba(54, 81, 130, 0.4), 0 2px 4px 2px rgba(54, 81, 130, 0.2);
    color: white;
  }
`;

export const ButtonIcon: FunctionComponent<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <InnerButtonIcon
      className={`transition-colors duration-200 ease-out cursor-pointer font-bold p-2 rounded shadow-md border border-transparent text-primary hover:text-primary-dark bg-white hover:bg-gray-100 hidden md:inline-block ${className} ${
        disabled && "cursor-not-allowed"
      }`}
      type="submit"
      disabled={disabled}
      {...props}
    >
      {children}
    </InnerButtonIcon>
  );
};

interface TabsProps {
  templates: { id: string; label: string }[];
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
  onPrint: () => void;
}

export const Tabs: React.FunctionComponent<TabsProps> = ({
  selectedTemplate,
  templates,
  onSelectTemplate,
  onPrint,
}) => {
  return (
    <nav className="flex justify-between">
      <ul className="flex flex-wrap bg-gray-100 p-0">
        {templates.map(({ id, label }) => (
          <li
            data-testid="tabs-item"
            key={id}
            id={id}
            className={
              id === selectedTemplate
                ? "transition-colors duration-200 ease-out font-roboto-bold px-6 py-2 mr-2 border-t-2 border-solid focus:outline-none border-primary bg-white"
                : "transition-colors duration-200 ease-out font-roboto-bold px-6 py-2 mr-2 border-t-2 border-solid focus:outline-none border-grey-light bg-grey-light hover:bg-grey-lighter hover:border-grey-lighter cursor-pointer"
            }
            onClick={() => {
              onSelectTemplate(id);
            }}
          >
            {label}
          </li>
        ))}
      </ul>

      <ButtonIcon aria-label="document-utility-print-button" onClick={onPrint}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
      </ButtonIcon>
    </nav>
  );
};
