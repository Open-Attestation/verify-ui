import React from "react";

interface TabsProps {
  templates: { id: string; label: string }[];
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
}

export const Tabs: React.FunctionComponent<TabsProps> = ({ selectedTemplate, templates, onSelectTemplate }) => {
  return (
    <nav>
      <ul className="flex flex-wrap bg-gray-100 p-0">
        {templates.map(({ id, label }) => (
          <li key={id} className="cursor-pointer">
            <button
              className={
                id === selectedTemplate
                  ? "transition-colors duration-200 ease-out font-roboto-bold px-6 py-2 mr-2 border-t-2 border-solid focus:outline-none border-primary bg-white"
                  : "transition-colors duration-200 ease-out font-roboto-bold px-6 py-2 mr-2 border-t-2 border-solid focus:outline-none border-grey-light bg-grey-light hover:bg-grey-lighter hover:border-grey-lighter"
              }
              id={id}
              onClick={() => {
                onSelectTemplate(id);
              }}
              role="tab"
              aria-controls="home"
              aria-selected="true"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
