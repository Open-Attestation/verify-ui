import React, { Fragment } from "react";

function recurselyGenerateList(clauses: string[] | JSX.Element[]): JSX.Element {
  const results: JSX.Element[] = [];

  for (const clause of clauses) {
    if (Array.isArray(clause)) {
      const result: JSX.Element = recurselyGenerateList(clause);
      results.push(result);
      continue;
    }
    results.push(
      <li>
        <p className="text-justify ml-2">{clause}</p>
      </li>
    );
  }
  return <ol className="ol-nested">{results}</ol>;
}

export function GenerateDoc(doc: Record<string, string[] | JSX.Element[]>): JSX.Element {
  return (
    <div>
      {Object.entries(doc).map(([heading, clauses], index) => (
        <Fragment key={index}>
          <h4 className="text-primary mt-8 mb-1">{heading}</h4>
          {recurselyGenerateList(clauses)}
        </Fragment>
      ))}
    </div>
  );
}
