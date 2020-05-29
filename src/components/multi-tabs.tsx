import React from "react";

interface MultiTabsProps {
  templates: { id: string; label: string }[];
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
}

export const MultiTabs: React.FunctionComponent<MultiTabsProps> = ({
  selectedTemplate,
  templates,
  onSelectTemplate,
}) => {
  return (
    <ul className="flex flex row bg-gray-100 justify-center py-8">
      {templates && templates.length > 0
        ? templates.map(({ id, label }) => (
            <li key={id} className="cursor-pointer font-medium">
              <button
                className={id === selectedTemplate ? "border-b border-black border-solid px-6 py-2 " : "px-6 py-2 "}
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
          ))
        : null}
    </ul>
  );
};
