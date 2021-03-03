import React, { Fragment } from "react";
import styles from "./legal-list.module.css";

const recursivelyGenerateList = (clauses: string[] | JSX.Element[]): JSX.Element => {
  const results: JSX.Element[] = [];

  for (const clause of clauses) {
    if (Array.isArray(clause)) {
      const result: JSX.Element = recursivelyGenerateList(clause);
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
};

export const GenerateDoc = (doc: Record<string, string[] | JSX.Element[]>): JSX.Element => {
  return (
    <div className={styles["legal-list"]}>
      {Object.entries(doc).map(([heading, clauses], index) => (
        <Fragment key={index}>
          <h4 className="text-primary mt-8 mb-1">{heading}</h4>
          {recursivelyGenerateList(clauses)}
        </Fragment>
      ))}
    </div>
  );
};
