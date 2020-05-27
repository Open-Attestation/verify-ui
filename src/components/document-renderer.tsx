import { FrameActions, FrameConnector, HostActionsHandler } from "@govtechsg/decentralized-renderer-react-components";
import { getData, WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState, useCallback, useEffect } from "react";

interface DocumentRendererProps {
  rawDocument: WrappedDocument;
}

export const DocumentRenderer: React.FunctionComponent<DocumentRendererProps> = ({
  rawDocument,
}: DocumentRendererProps) => {
  const document = getData(rawDocument);

  const [toFrame, setToFrame] = useState<HostActionsHandler | null>();
  const [height, setHeight] = useState();
  const onConnected = useCallback((toFrame: HostActionsHandler) => {
    // wrap into a function otherwise toFrame function will be executed
    setToFrame(() => toFrame);
  }, []);

  const fromFrame = useCallback((action: FrameActions): void => {
    if (action.type === "UPDATE_HEIGHT") {
      setHeight(action.payload);
    }
  }, []);

  // let's set the frame action to null every time a new document is passed down, the actions will be set once the connection established
  useEffect(() => {
    setToFrame(null);
  }, [document]);

  useEffect(() => {
    if (toFrame) {
      toFrame({
        type: "RENDER_DOCUMENT",
        payload: {
          document,
        },
      });
    }
  }, [document, toFrame]);

  return (
    <FrameConnector
      style={{ height: `${height}px`, width: "100%", border: "0px" }}
      source={document.$template.url}
      onConnected={onConnected}
      dispatch={fromFrame}
      key={document.id} // we will reset the connection every time the id change (react will mount a new component)
    />
  );
};
