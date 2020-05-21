import { FrameActions, FrameConnector, HostActionsHandler } from "@govtechsg/decentralized-renderer-react-components";
import { getData, WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState, useCallback, useEffect } from "react";

export const ViewerPage: React.FunctionComponent = (props: any) => {
  const rawDocument: WrappedDocument<any> = props.location.state.json;
  const document = getData(rawDocument);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const updateTemplates = useCallback((templates) => {
    setTemplates(templates);
    setSelectedTemplate(templates[0].id);
  }, []);

  const [toFrame, setToFrame] = useState<HostActionsHandler>();
  const [height, setHeight] = useState();
  const onConnected = useCallback((toFrame: HostActionsHandler) => {
    // wrap into a function otherwise toFrame function will be executed
    setToFrame(() => toFrame);
  }, []);

  const fromFrame = useCallback(
    (action: FrameActions): void => {
      if (action.type === "UPDATE_HEIGHT") {
        setHeight(action.payload);
      }
      if (action.type === "UPDATE_TEMPLATES") {
        updateTemplates(action.payload);
      }
    },
    [updateTemplates]
  );

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
  useEffect(() => {
    if (toFrame && selectedTemplate) {
      console.log("select template", selectedTemplate);
      toFrame({
        type: "SELECT_TEMPLATE",
        payload: selectedTemplate,
      });
    }
  }, [selectedTemplate, toFrame]);

  return (
    <FrameConnector
      style={{ height: `${height}px`, width: "100%", border: "0px" }}
      source={document.$template.url}
      onConnected={onConnected}
      dispatch={fromFrame}
    />
  );
};
