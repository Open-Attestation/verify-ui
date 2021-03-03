import React, { Fragment } from "react";
import "./legal-list.css";

function recurselyGenerateList(clauses: string[]): JSX.Element {
  const results: JSX.Element[] = [];

  for (const clause of clauses) {
    if (Array.isArray(clause)) {
      const result: JSX.Element = recurselyGenerateList(clause);
      results.push(result);
      continue;
    }
    results.push(
      <li className="flex">
        <p className="text-justify ml-2">{clause}</p>
      </li>
    );
  }
  return <ol>{results}</ol>;
}

export function TermsOfUse(doc: Record<string, string[]>): JSX.Element {
  return (
    <div id="legal-list">
      {Object.entries(doc).map(([heading, clauses], index) => (
        <Fragment key={index}>
          <h4 className="text-primary mt-2">{heading}</h4>
          {recurselyGenerateList(clauses)}
        </Fragment>
      ))}
    </div>
  );
}
