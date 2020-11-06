import React from "react";

export const Masthead: React.FunctionComponent = () => (
  <header className="sgds-masthead">
    <div className="container">
      <div className="flex flex-wrap">
        <div className="w-full">
          <a href="https://www.gov.sg" target="_blank" rel="noopener noreferrer">
            <span className="sgds-icon sgds-icon-sg-crest" />
            <span className="is-text">A Singapore Government Agency Website</span>
          </a>
        </div>
      </div>
    </div>
  </header>
);
