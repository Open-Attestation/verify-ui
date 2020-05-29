import { FrameActions, FrameConnector, HostActionsHandler } from "@govtechsg/decentralized-renderer-react-components";
import { getData, WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState, useCallback, useEffect } from "react";
import { MultiTabs } from "./multi-tabs";

interface DocumentRendererProps {
  rawDocument: WrappedDocument;
}

export const DocumentRenderer: React.FunctionComponent<DocumentRendererProps> = ({
  rawDocument,
}: DocumentRendererProps) => {
  const document = getData(rawDocument);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const updateTemplates = useCallback((templates) => {
    setTemplates(templates);
    setSelectedTemplate(templates[0].id);
  }, []);

  const [toFrame, setToFrame] = useState<HostActionsHandler | null>();
  const [height, setHeight] = useState<number>();
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

  useEffect(() => {
    if (toFrame && selectedTemplate) {
      // TODO: how can i get this to run?
      toFrame({
        type: "SELECT_TEMPLATE",
        payload: selectedTemplate,
      });
    }
  }, [selectedTemplate, toFrame]);

  return (
    <>
      <MultiTabs
        templates={templates}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={(selectedTemplate) => setSelectedTemplate(selectedTemplate)}
      />
      <FrameConnector
        style={{ height: `${height}px`, width: "100%", border: "0px" }}
        source={document.$template.url}
        onConnected={onConnected}
        dispatch={fromFrame}
        key={document.id} // we will reset the connection every time the id change (react will mount a new component)
      />
    </>
  );
};
