import React from "react";
import ROPSTEN_DEMO from "./Ropsten-Demo.json";

export const DraggableDemoCertificate: React.FunctionComponent = () => (
  <div className="w-32 h-32 m-32">
    <div draggable onDragStart={() => console.log("dragged")}>
      <a href={`data:text/plain;,${JSON.stringify(ROPSTEN_DEMO, null, 2)}`}">
        <img
          data-testid="demo-cert"
          style={{ cursor: "grabbing" }}
          src="/static/images/dropzone/cert.png"
          width="100%"
        />
      </a>
    </div>
  </div>
);
