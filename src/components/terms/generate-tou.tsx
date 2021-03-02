import React from "react";

function recurselyGenerateList(clauses: string[]): JSX.Element {

    const results: JSX.Element[] = [];

    for (const clause of clauses) {
        if (Array.isArray(clause)) {
            const result: JSX.Element = recurselyGenerateList(clause);
            results.push(result);
            continue;
        }
        results.push(<li>{clause}</li>)
    }
    return <ol className="ol-nested">
        {results}
    </ol>
}

export function generateTOU(doc: Record<string, string[]>): JSX.Element {

    return <div>
        {Object.entries(doc).map(([heading, clauses]) => <div>
            <h4 className="text-primary mb-2">{heading}</h4>
            {recurselyGenerateList(clauses)}
        </div>)}
    </div>
    
}