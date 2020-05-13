import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";
import ROPSTEN_DEMO from "./Ropsten-Demo.json";

const pulse = keyframes`
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
`;

const CertIcon = styled.img`
  animation: ${pulse} 3s alternate infinite;
`;

export const DraggableDemoCertificate: React.FunctionComponent = () => (
  <div className="w-32 h-32 m-32">
    <div draggable onDragStart={() => console.log("dragged")}>
      <a href={`data:text/plain;,${JSON.stringify(ROPSTEN_DEMO, null, 2)}`} download="demo.tt">
        <CertIcon
          data-testid="demo-cert"
          style={{ cursor: "grabbing" }}
          src="/static/images/dropzone/cert.png"
          width="100%"
        />
      </a>
    </div>
  </div>
);
